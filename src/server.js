// Load base .env first
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Then load environment-specific .env.<NODE_ENV> to override base values
try {
  const env = process.env.NODE_ENV || 'development';
  const envPath = path.resolve(process.cwd(), `.env.${env}`);
  require('dotenv').config({ path: envPath });
} catch (e) {
  // Silently ignore if env-specific file does not exist
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const { authenticateToken, requireRole } = require('./middlewares/auth');
const { TokenBlocklist } = require('./models');
const { Op } = require('sequelize');
const cron = require('node-cron');
const { generatePendingTransactions } = require('./services/recurrenceService');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const storeRoutes = require('./routes/stores');
const footballTeamsRoutes = require('./routes/footballTeams');
const eventRoutes = require('./routes/events');
const eventOpenRoutes = require('./routes/eventsOpen');
const eventJamsRoutes = require('./routes/eventJams');
const { uploadRouter, uploadFileToDrive } = require('./routes/upload');
const filesRoutes = require('./routes/files');
const financialRoutes = require('./routes/financial');
const finRecurrenceRoutes = require('./routes/finRecurrences');
const bankAccountRoutes = require('./routes/bankAccounts');
const partyRoutes = require('./routes/parties');
const finCategoryRoutes = require('./routes/finCategories');
const finCostCenterRoutes = require('./routes/finCostCenters');
const finTagRoutes = require('./routes/finTags');
const sysModuleRoutes = require('./routes/sysModules');
const eventJamMusicSuggestionRoutes = require('./routes/eventJamMusicSuggestions');
const musicCatalogRoutes = require('./routes/musicCatalog');

// Import middleware
const errorHandler = require('./middlewares/errorHandler');

// Import database connection
const { sequelize, testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 4000;

// CORREÇÃO OBRIGATÓRIA NO RENDER (resolve o erro do rate-limit + SSE)
app.set('trust proxy', 1); // ou true → essencial!

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DM-APP API',
      version: '1.0.0',
      description: 'API para sistema de bares e restaurantes',
    },
    servers: [
      {
        url: process.env.API_PUBLIC_BASE_URL || `http://localhost:${PORT}`,
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(swaggerOptions);

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false, // Necessário para permitir scripts inline na página de status
}));

// CORS configuration
const parseOrigins = (value) => (value || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const whitelist = parseOrigins(process.env.CORS_ORIGIN);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (whitelist.includes(origin)) return callback(null, true);

    if ((process.env.NODE_ENV || 'development') !== 'production') {
      const localhostRange = /^http:\/\/localhost:(42|43)\d{2}$/;
      if (localhostRange.test(origin)) return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// Compression com proteção para SSE
const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) return false;
  if (req.headers['accept']?.includes('text/event-stream')) return false;
  return compression.filter(req, res);
};
app.use(compression({ filter: shouldCompress }));

// Rate limiting (agora funciona corretamente com trust proxy)
// Ajustado para eventos: 300 reqs/min por IP (suporta ~200 usuários simultâneos intensos)

// Middleware de monitoramento de requisições por IP (Debug)
// Variável global para armazenar métricas
const metrics = {
  ips: {},
  routes: {},
  totalRequests: 0,
  startTime: Date.now()
};

// Limpa contadores a cada minuto (referência guardada para graceful shutdown)
const metricsInterval = setInterval(() => {
  metrics.ips = {};
  metrics.routes = {};
  metrics.totalRequests = 0;
  metrics.startTime = Date.now();
}, 60000);

// Limpeza automática de tokens expirados da blocklist (a cada 1 hora)
// Evita crescimento indefinido da tabela token_blocklists
const blocklistCleanupInterval = setInterval(async () => {
  try {
    const deleted = await TokenBlocklist.destroy({
      where: { expiresAt: { [Op.lt]: new Date() } }
    });
    if (deleted > 0) {
      console.log(`[Blocklist Cleanup] ${deleted} token(s) expirado(s) removido(s).`);
    }
  } catch (err) {
    console.error('[Blocklist Cleanup] Erro ao limpar tokens:', err.message);
  }
}, 60 * 60 * 1000); // 1 hora

// CRON JOB: Processamento diário de recorrências financeiras
// Roda todos os dias às 00:05 para provisionar as transações que venceram
const recurrenceCronJob = cron.schedule('5 0 * * *', async () => {
  console.log('[Cron] Iniciando processamento de recorrências financeiras...');
  const results = await generatePendingTransactions();
  console.log(`[Cron] Processamento concluído: ${results.processed} lidas, ${results.generated} geradas, ${results.errors} erros.`);
});

// CRON JOB: Sincronização periódica dos logs de Rate Limit para o Google Drive
// Roda a cada 2 horas (ou ajustar conforme necessidade)
const logSyncCronJob = cron.schedule('0 */2 * * *', async () => {
  console.log('[Cron] Verificando logs locais para sincronização com o Drive...');
  const logFilePath = path.join(process.cwd(), 'rate-limit-blocks.log');

  if (fs.existsSync(logFilePath)) {
    try {
      const stats = fs.statSync(logFilePath);
      // Sincroniza apenas se o arquivo for maior que o cabeçalho base de ~35 bytes
      if (stats.size > 50) {
        const fileContent = fs.readFileSync(logFilePath);

        // Simular um File Object como esperado pelo Multer
        const fileObject = {
          originalname: `rate_limit_logs_${new Date().toISOString().replace(/[:.]/g, '-')}.log`,
          buffer: fileContent,
          mimetype: 'text/plain',
        };

        console.log(`[Cron] Iniciando upload do log de ${stats.size} bytes para o Drive...`);
        // Faz o upload para a pasta 'Logs' no drive
        await uploadFileToDrive(fileObject, 'Logs');
        console.log('[Cron] Upload concluído. Limpando log local.');

        // Limpa o log (mas mantém o cabeçalho inicial se desejar, ou apenas trunca)
        fs.writeFileSync(logFilePath, '=== DM-APP API Rate Limit Logs ===\n');
      } else {
        console.log('[Cron] Arquivo de log pequeno/vazio, pulando sync.');
      }
    } catch (e) {
      console.error('[Cron] Falha ao sincronizar os logs para o Drive:', e.message);
    }
  }
});

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    // Ignora requisições de métricas para não poluir os dados
    if (req.path === '/api/status-metrics') return next();

    const ip = req.ip;
    metrics.totalRequests++;

    // Contagem por IP
    metrics.ips[ip] = (metrics.ips[ip] || 0) + 1;

    // Contagem por Rota (agrupa por método e path genérico)
    const routeKey = `${req.method} ${req.path}`;
    metrics.routes[routeKey] = (metrics.routes[routeKey] || 0) + 1;

    if (metrics.ips[ip] % 10 === 0) { // Loga a cada 10 requisições
      console.log(`[DEBUG RATE] IP: ${ip} | Reqs/Min: ${metrics.ips[ip]} | Rota: ${req.method} ${req.originalUrl}`);
    }
    next();
  });
}

const isLocalhost = (ip) => ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 1 * 60 * 1000, // 1 minuto
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000, // 1000 requests por minuto (suporta redes NAT com muitos convidados de evento)
  handler: (req, res, next, options) => {
    const logMsg = `[${new Date().toISOString()}] 429 BLOCK | IP: ${req.ip} | Rota: ${req.method} ${req.originalUrl} | User-Agent: ${req.headers['user-agent'] || 'N/A'} | Origin: ${req.headers.origin || req.headers.referer || 'N/A'}\n`;
    console.warn(logMsg.trim());
    try {
      fs.appendFileSync(path.join(process.cwd(), 'rate-limit-blocks.log'), logMsg);
    } catch (e) {
      console.error('Falha ao escrever log de rate limit:', e.message);
    }
    res.status(options.statusCode).json(options.message);
  },
  skip: (req) => {
    // Ignora status-metrics ou se for localhost EM desenvolvimento
    if (req.originalUrl.includes('/status-metrics')) return true;
    if (process.env.NODE_ENV === 'development' && isLocalhost(req.ip)) return true;
    return false;
  },
  message: {
    error: 'Too many requests',
    message: 'Muitas requisições. Tente novamente em alguns segundos.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // 1 minuto
  delayAfter: 200, // Começa a atrasar após 200 requests
  delayMs: () => 500, // Adiciona 500ms de delay por request extra
  skip: (req) => {
    if (req.originalUrl.includes('/status-metrics')) return true;
    if (process.env.NODE_ENV === 'development' && isLocalhost(req.ip)) return true;
    return false;
  },
});

// Limitador específico para o dashboard de status (para não consumir cota global mas evitar abuso)
const statusLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 60, // 60 requests por minuto (1 por segundo - suficiente para o refresh de 2s)
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many status updates' }
});

// Aplica limiter e slowdown em tudo, exceto na rota SSE
app.use('/api/', limiter);
app.use('/api/', speedLimiter);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files
app.use('/uploads', express.static('uploads'));

// ROTA RAIZ
app.get('/', (req, res) => {
  // Se o cliente pedir JSON, retorna JSON
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      message: 'DM-APP API - OK',
      environment: process.env.NODE_ENV || 'development',
      docs: process.env.NODE_ENV === 'development'
        ? `${process.env.API_PUBLIC_BASE_URL || `http://localhost:${PORT}`}/api-docs`
        : 'Available only in development',
      health: '/api/v1/health',
      sse_test: process.env.ENABLE_SSE === 'true' ? '/api/stream-test' : 'disabled'
    });
  }

  // Caso contrário, retorna página HTML amigável
  const env = process.env.NODE_ENV || 'development';
  const sseEnabled = process.env.ENABLE_SSE === 'true';

  // Format Uptime
  const uptimeSeconds = process.uptime();
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = Math.floor(uptimeSeconds % 60);
  const uptimeString = `${hours}h ${minutes}m ${seconds}s`;

  // Limite de Rate Limit
  const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 300;
  const currentIp = req.ip;
  const currentIpCount = metrics.ips[currentIp] || 0;
  const currentIpPercent = Math.min((currentIpCount / rateLimitMax) * 100, 100).toFixed(1);

  // Tempo restante para reset
  const timeSinceReset = Date.now() - metrics.startTime;
  const timeToReset = Math.max(0, 60000 - timeSinceReset);
  const secondsToReset = Math.ceil(timeToReset / 1000);

  // Prepara dados de métricas para exibição (apenas se for admin ou dev - aqui aberto para demo)
  const topIps = Object.entries(metrics.ips)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5 IPs

  const topRoutes = Object.entries(metrics.routes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5 Rotas

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>DM-APP API | Status</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          background-color: #f0f2f5;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          color: #333;
          padding: 20px;
        }
        .container {
          background: white;
          padding: 2rem 3rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          text-align: center;
          max-width: 600px;
          width: 100%;
        }
        .status-dot {
          height: 12px;
          width: 12px;
          background-color: #10b981;
          border-radius: 50%;
          display: inline-block;
          margin-right: 8px;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.2);
        }
        h1 { margin-bottom: 0.5rem; color: #1f2937; }
        p.subtitle { color: #6b7280; margin-top: 0; margin-bottom: 2rem; }
        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1rem;
          text-align: left;
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        .item { display: flex; justify-content: space-between; font-size: 0.95rem; }
        .label { color: #4b5563; font-weight: 500; }
        .value { font-family: monospace; color: #6366f1; background: #eef2ff; padding: 2px 6px; border-radius: 4px; }
        .footer { margin-top: 2rem; font-size: 0.85rem; color: #9ca3af; }
        a { color: #4f46e5; text-decoration: none; font-weight: 500; }
        a:hover { text-decoration: underline; }
        
        .metrics-section {
          margin-top: 1.5rem;
          text-align: left;
          border-top: 1px solid #e5e7eb;
          padding-top: 1rem;
        }
        .metrics-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .metric-list {
          list-style: none;
          padding: 0;
          margin: 0;
          font-size: 0.85rem;
        }
        .metric-item {
          display: flex;
          justify-content: space-between;
          padding: 4px 0;
          border-bottom: 1px dashed #e5e7eb;
        }
        .metric-item:last-child { border-bottom: none; }
        .metric-count {
          background: #fee2e2;
          color: #991b1b;
          padding: 1px 6px;
          border-radius: 10px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        .refresh-hint {
          font-size: 0.75rem;
          color: #9ca3af;
          font-weight: normal;
        }
        .progress-bar-bg {
          background-color: #e5e7eb;
          height: 6px;
          border-radius: 3px;
          margin-top: 4px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background-color: #6366f1;
          transition: width 0.3s ease;
        }
        .warning-text { color: #d97706; }
        .danger-text { color: #dc2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="margin-bottom: 1rem;">
          <span class="status-dot"></span>
          <span style="color: #10b981; font-weight: 600; font-size: 0.9rem;">SYSTEM OPERATIONAL</span>
        </div>
        <h1>DM-APP API</h1>
        <p class="subtitle">Backend Services & Data Management</p>
        
        <div class="grid">
          <div class="item">
            <span class="label">Environment</span>
            <span class="value">${env}</span>
          </div>
          <div class="item">
            <span class="label">Version</span>
            <span class="value">v1.0.0</span>
          </div>
          <div class="item">
            <span class="label">Uptime</span>
            <span class="value">${uptimeString}</span>
          </div>
          <div class="item">
            <span class="label">SSE Service</span>
            <span class="value" style="color: ${sseEnabled ? '#10b981' : '#ef4444'}; background: ${sseEnabled ? '#ecfdf5' : '#fef2f2'};">
              ${sseEnabled ? 'ENABLED' : 'DISABLED'}
            </span>
          </div>
          ${env === 'development' ? `
          <div class="item">
            <span class="label">Documentation</span>
            <span><a href="/api-docs">Swagger UI &rarr;</a></span>
          </div>
          ` : ''}
          <div class="item">
            <span class="label">Health Check</span>
            <span><a href="/api/v1/health">/api/v1/health &rarr;</a></span>
          </div>
        </div>

        <!-- Real-time Metrics Section -->
        <div class="metrics-section" id="metrics-container">
          <div class="metrics-title">
            <span>Traffic Control (Reset in <span id="reset-timer">${secondsToReset}</span>s)</span>
            <span class="refresh-hint" id="refresh-status">Live Updates</span>
          </div>

          <!-- Current IP Status -->
          <div style="background: #f3f4f6; padding: 10px; border-radius: 6px; margin-bottom: 1rem;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 4px;">
              <span style="font-weight: 600;">Your IP (<span id="current-ip">${currentIp === '::1' ? 'Localhost' : currentIp}</span>)</span>
              <span id="usage-text" style="font-weight: 600; color: ${currentIpPercent > 80 ? '#dc2626' : '#4b5563'}">
                ${currentIpCount} / ${rateLimitMax} reqs
              </span>
            </div>
            <div class="progress-bar-bg">
              <div id="usage-bar" class="progress-bar-fill" style="width: ${currentIpPercent}%; background-color: ${currentIpPercent > 80 ? '#dc2626' : (currentIpPercent > 50 ? '#d97706' : '#10b981')}"></div>
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 0.5rem;">
            <div>
              <div style="font-size: 0.8rem; font-weight: 600; color: #6b7280; margin-bottom: 4px;">Top IPs</div>
              <ul class="metric-list" id="top-ips">
                ${topIps.length ? topIps.map(([ip, count]) => `
                  <li class="metric-item">
                    <span title="${ip}">${ip === '::1' ? 'Localhost' : ip.substring(0, 15)}</span>
                    <span class="metric-count">${count}</span>
                  </li>
                `).join('') : '<li class="metric-item" style="color: #9ca3af;">No traffic</li>'}
              </ul>
            </div>
            
            <div>
              <div style="font-size: 0.8rem; font-weight: 600; color: #6b7280; margin-bottom: 4px;">Top Routes</div>
              <ul class="metric-list" id="top-routes">
                ${topRoutes.length ? topRoutes.map(([route, count]) => `
                  <li class="metric-item">
                    <span title="${route}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">${route}</span>
                    <span class="metric-count">${count}</span>
                  </li>
                `).join('') : '<li class="metric-item" style="color: #9ca3af;">No traffic</li>'}
              </ul>
            </div>
          </div>
          
          <div style="margin-top: 10px; font-size: 0.8rem; text-align: right; color: #6b7280;">
            Global Total (1m): <b id="total-requests">${metrics.totalRequests}</b>
          </div>
        </div>

        <div class="footer">
          &copy; ${new Date().getFullYear()} DM-APP Team. All systems nominal.
        </div>
      </div>
      <script>
        // Update timer every second locally
        const timerEl = document.getElementById('reset-timer');
        setInterval(() => {
          let val = parseInt(timerEl.innerText);
          if (val > 0) timerEl.innerText = val - 1;
        }, 1000);

        // Fetch metrics every 2 seconds without reloading page
        async function updateMetrics() {
          if (document.visibilityState !== 'visible') return;
          
          try {
            const res = await fetch('/api/status-metrics');
            if (!res.ok) return;
            const data = await res.json();
            
            // Update Timer
            timerEl.innerText = data.secondsToReset;

            // Update Usage Text & Bar
            const usageText = document.getElementById('usage-text');
            const usageBar = document.getElementById('usage-bar');
            
            usageText.innerText = \`\${data.currentIpCount} / \${data.rateLimitMax} reqs\`;
            usageText.style.color = data.currentIpPercent > 80 ? '#dc2626' : '#4b5563';
            
            usageBar.style.width = \`\${data.currentIpPercent}%\`;
            usageBar.style.backgroundColor = data.currentIpPercent > 80 ? '#dc2626' : (data.currentIpPercent > 50 ? '#d97706' : '#10b981');

            // Update Top IPs
            const ipsList = document.getElementById('top-ips');
            if (data.topIps.length) {
              ipsList.innerHTML = data.topIps.map(([ip, count]) => \`
                  <li class="metric-item">
                    <span title="\${ip}">\${ip === '::1' ? 'Localhost' : ip.substring(0, 15)}</span>
                    <span class="metric-count">\${count}</span>
                  </li>
              \`).join('');
            } else {
              ipsList.innerHTML = '<li class="metric-item" style="color: #9ca3af;">No traffic</li>';
            }

            // Update Top Routes
            const routesList = document.getElementById('top-routes');
            if (data.topRoutes.length) {
              routesList.innerHTML = data.topRoutes.map(([route, count]) => \`
                  <li class="metric-item">
                    <span title="\${route}" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;">\${route}</span>
                    <span class="metric-count">\${count}</span>
                  </li>
              \`).join('');
            } else {
              routesList.innerHTML = '<li class="metric-item" style="color: #9ca3af;">No traffic</li>';
            }

            // Update Total
            document.getElementById('total-requests').innerText = data.totalRequests;

          } catch (e) {
            console.error('Metrics update failed', e);
          }
        }

        setInterval(updateMetrics, 10000);
      </script>
    </body>
    </html>
  `;

  res.send(html);
});

// Endpoint leve para atualização via AJAX — protegido: apenas admins podem acessar
app.get('/api/status-metrics', statusLimiter, authenticateToken, requireRole('admin', 'master', 'masteradmin'), (req, res) => {
  // Limite de Rate Limit
  const rateLimitMax = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 300;
  const currentIp = req.ip;
  const currentIpCount = metrics.ips[currentIp] || 0;
  const currentIpPercent = Math.min((currentIpCount / rateLimitMax) * 100, 100).toFixed(1);

  // Tempo restante para reset
  const timeSinceReset = Date.now() - metrics.startTime;
  const timeToReset = Math.max(0, 60000 - timeSinceReset);
  const secondsToReset = Math.ceil(timeToReset / 1000);

  const topIps = Object.entries(metrics.ips)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const topRoutes = Object.entries(metrics.routes)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  res.json({
    rateLimitMax,
    currentIpCount,
    currentIpPercent,
    secondsToReset,
    topIps,
    topRoutes,
    totalRequests: metrics.totalRequests
  });
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// === ROTA SSE (Opcional - Ativada via ENV) ===
if (process.env.ENABLE_SSE === 'true') {
  app.get('/api/stream-test', (req, res) => {
    const origin = req.headers.origin;

    // CORS para SSE
    if (origin && whitelist.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Headers obrigatórios para SSE funcionar em qualquer proxy
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // Crucial no Render/Nginx/Cloudflare

    // Evita compressão gzip na stream
    req.headers['x-no-compression'] = 'true';

    res.flushHeaders();

    // Envia mensagem inicial
    res.write(`data: ${JSON.stringify({
      type: 'connection',
      message: 'Conectado ao DM-APP SSE',
      time: new Date().toISOString()
    })}\n\n`);

    const interval = setInterval(() => {
      const data = {
        time: new Date().toISOString(),
        online: true,
        uptime: process.uptime(),
        random: Math.floor(Math.random() * 1000000)
      };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    }, 3000);

    // Limpeza ao fechar conexão
    req.on('close', () => {
      clearInterval(interval);
      console.log('SSE desconectado:', req.ip);
    });
  });
}

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/stores', storeRoutes);
app.use('/api/v1/football-teams', footballTeamsRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/events', eventOpenRoutes);
app.use('/api/public/v1/events', eventOpenRoutes);
app.use('/api/v1/events', eventJamsRoutes);
app.use('/api/events', eventJamsRoutes);
app.use('/api/public/v1/events', eventJamsRoutes);
app.use('/api/v1/uploads', uploadRouter);
app.use('/api/v1/files', filesRoutes);
app.use('/api/v1/financial/bank-accounts', bankAccountRoutes);
app.use('/api/v1/financial/parties', partyRoutes);
app.use('/api/v1/financial/categories', finCategoryRoutes);
app.use('/api/v1/financial/cost-centers', finCostCenterRoutes);
app.use('/api/v1/financial/tags', finTagRoutes);
app.use('/api/v1/financial', financialRoutes);
app.use('/api/v1/financial', finRecurrenceRoutes);
app.use('/api/v1/sys-modules', sysModuleRoutes);
app.use('/api/v1/music-suggestions', eventJamMusicSuggestionRoutes);
app.use('/api/v1/music-catalog', musicCatalogRoutes);

// Swagger UI(apenas dev)
if (process.env.NODE_ENV === 'development') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

// 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint não encontrado'
  });
});

// Error handler
app.use(errorHandler);

// Graceful shutdown
let server;

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  clearInterval(metricsInterval);
  clearInterval(blocklistCleanupInterval);
  recurrenceCronJob.stop();
  logSyncCronJob.stop();
  if (server) {
    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  }
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    if (process.env.NODE_ENV === 'development') {
      console.log(`Docs: ${process.env.API_PUBLIC_BASE_URL || `http://localhost:${PORT}`}/api-docs`);
    }

    // Check Services Status
    const checkServices = async () => {
      console.log('\n--- Service Status ---');

      // Upload Path
      const uploadPath = process.env.UPLOAD_PATH || './uploads';
      try {
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        fs.accessSync(uploadPath, fs.constants.W_OK);
        console.log('✅ Upload Service: Ready (Write Access OK)');
      } catch (err) {
        console.log('❌ Upload Service: Failed (No Write Access)');
      }

      // PDF Service (Puppeteer)
      try {
        require('puppeteer');
        console.log('✅ PDF Service: Ready (Puppeteer Installed)');
      } catch (e) {
        console.log('⚠️ PDF Service: Warning (Puppeteer not found)');
      }

      // SSE Status
      const sseEnabled = process.env.ENABLE_SSE === 'true';
      console.log(sseEnabled
        ? '✅ SSE Service: Enabled'
        : 'qc SSE Service: Disabled (Polling Mode Recommended)');

      // Firebase
      const firebaseConfigured = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY;
      console.log(firebaseConfigured
        ? '✅ Firebase Service: Configured'
        : '⚠️ Firebase Service: Not Configured');

      console.log('----------------------\n');
    };

    checkServices();
  });
}

// Database connection
(async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await testConnection();
      console.log('Database connected successfully');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
})();

module.exports = app;
