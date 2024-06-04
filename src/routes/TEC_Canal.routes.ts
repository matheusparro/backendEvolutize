import express from 'express';
import TEC_CanalController from '../controllers/TEC_Canal.controller';
import TEC_CanalService from '../services/TEC_Canal.service';
import { clientManager, transactionScope } from '../config/transactions';

const router = express.Router();
const canalService = new TEC_CanalService(transactionScope, clientManager);
const canalController = new TEC_CanalController(canalService);

// Rota para criar um canal
router.post('/notification/tec_canal', async (request, response) => {
  try {
    await canalController.createCanal(request, response);
  } catch (error:any) {
    console.error('Erro ao criar canal:', error);
    response.status(500).json({ error: error.message || 'Erro ao criar canal.' });
  }
});

// Rota para buscar todos os canais
router.get('/notification/tec_canal', async (request, response) => {
  try {
    await canalController.getAllCanais(request, response);
  } catch (error:any) {
    console.error('Erro ao buscar todos os canais:', error);
    response.status(500).json({ error: error.message || 'Erro ao buscar todos os canais.' });
  }
});

router.post('/notification/tec_canal/sync/update', async (request, response) => {
  try {
    const {tec_canais} = request.body;
    for (const canal of tec_canais) {//update
       await canalController.updateCanal(canal.TEC_CanalId, canal);
    }
    return response.status(201);
  } catch (error) {
    console.error("Erro ao sincronizar informações do ERP com servidor node:", error);
    return response.status(500).json({ error: "Erro ao sincronizar informações do ERP com servidor node." });
  }
});

// Rota para buscar um canal por ID
router.get('/notification/tec_canal/:id', async (request, response) => {
  try {
    await canalController.getCanalById(request, response);
  } catch (error:any) {
    console.error('Erro ao buscar canal por ID:', error);
    response.status(500).json({ error: error.message || 'Erro ao buscar canal por ID.' });
  }
});

// Rota para deletar um canal
router.delete('/notification/tec_canal/:id', async (request, response) => {
  try {
    await canalController.deleteCanal(request, response);
  } catch (error:any) {
    console.error('Erro ao deletar canal:', error);
    response.status(500).json({ error: error.message || 'Erro ao deletar canal.' });
  }
});

// Rota para atualizar um canal
router.post('/notification/tec_canal/update/:id', async (request, response) => {
  try {
    await canalController.updateCanal(request, response);
  } catch (error:any) {
    console.error('Erro ao atualizar canal:', error);
    response.status(500).json({ error: error.message || 'Erro ao atualizar canal.' });
  }
});

export default router;
