const express = require('express');
const router = express.Router();
const { EventJamMusicCatalog } = require('../models');
const { Op } = require('sequelize');
const { authenticateToken } = require('../middlewares/auth');
const discogsService = require('../services/discogsService');

/**
 * GET /api/v1/music-catalog/search
 * Busca músicas no catálogo local e no Discogs (com cache automático)
 */
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    console.log(`[MusicCatalog] Buscando por: "${q}"`);

    // 1. Busca Local
    const localResults = await EventJamMusicCatalog.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { artist: { [Op.like]: `%${q}%` } }
        ]
      },
      limit: 20,
      order: [['usage_count', 'DESC']] // Prioriza as mais usadas
    });

    console.log(`[MusicCatalog] Encontrados ${localResults.length} resultados locais.`);

    // 2. Se tivermos poucos resultados locais, buscamos no Discogs
    let externalResults = [];
    try {
        console.log(`[MusicCatalog] Buscando no Discogs: "${q}"`);
        externalResults = await discogsService.search(q);
        console.log(`[MusicCatalog] Discogs retornou ${externalResults.length} resultados.`);
    } catch (err) {
        console.error('[MusicCatalog] Erro ao buscar no Discogs:', err.message);
    }

    // 3. Processamento dos Resultados Externos
    if (externalResults.length > 0) {
      const newEntries = [];
      const externalIds = externalResults.map(r => r.id);
      
      // Verifica quais já existem no banco (pelo discogs_id)
      const existingEntries = await EventJamMusicCatalog.findAll({
        where: { discogs_id: externalIds },
        attributes: ['id', 'discogs_id']
      });
      const existingDiscogsIds = existingEntries.map(r => r.discogs_id);

      for (const result of externalResults) {
        if (!existingDiscogsIds.includes(result.id)) {
          newEntries.push({
            discogs_id: result.id,
            title: result.title,
            artist: result.artist, 
            cover_image: result.cover_image,
            thumb_image: result.thumb,
            year: result.year,
            genre: result.genre ? result.genre[0] : null,
            extra_data: result,
            usage_count: 0
          });
        }
      }

      if (newEntries.length > 0) {
        console.log(`[MusicCatalog] Inserindo ${newEntries.length} novas músicas do Discogs no catálogo local.`);
        await EventJamMusicCatalog.bulkCreate(newEntries);
      } else {
        console.log('[MusicCatalog] Todos os resultados do Discogs já existem no banco.');
      }

      // 4. Retorna resultados combinados (Local + Novos/Existentes do Discogs)
      // Recarrega do banco para garantir que temos tudo padronizado e ordenado
      // Agora buscamos por (Query Match) OR (Discogs IDs encontrados)
      return res.json(await EventJamMusicCatalog.findAll({
          where: {
              [Op.or]: [
                { title: { [Op.like]: `%${q}%` } },
                { artist: { [Op.like]: `%${q}%` } },
                { discogs_id: externalIds } // Garante que o que veio do Discogs apareça, mesmo se o texto for ligeiramente diferente
              ]
          },
          limit: 50,
          order: [['usage_count', 'DESC'], ['title', 'ASC']]
      }));
    }

    // Se não teve novidades externas e nem resultados externos, retorna o local
    return res.json(localResults);

  } catch (error) {
    console.error('Erro ao buscar no catálogo:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
