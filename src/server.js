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

const authMiddleware = require('./middlewares/auth');

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
const uploadRoutes = require('./routes/upload');
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
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests',
    message: 'Muitas requisições. Tente novamente mais tarde.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slow down
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50,
  delayMs: () => 500,
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
          height: 100vh;
          margin: 0;
          color: #333;
        }
        .container {
          background: white;
          padding: 2rem 3rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          text-align: center;
          max-width: 500px;
          width: 90%;
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

        <div class="footer">
          &copy; ${new Date().getFullYear()} DM-APP Team. All systems nominal.
        </div>
      </div>
    </body>
    </html>
  `;
  
  res.send(html);
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
app.use('/api/v1/uploads', uploadRoutes);
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
