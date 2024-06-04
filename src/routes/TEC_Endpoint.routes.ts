import express from 'express';
import TEC_EndpointController from '../controllers/TEC_Endpoint.controller';
import { clientManager, transactionScope } from '../config/transactions';
import TEC_EndpointService from '../services/TEC_Endpoint.service';

const router = express.Router();
const tecEndpointService = new TEC_EndpointService(transactionScope, clientManager);
const tec_endpointController = new TEC_EndpointController(tecEndpointService);
router.post('/notification/user/lastlogin', async (req, res) => {
  try {
    await tec_endpointController.updateLastLogin(req, res);
  } catch (error: any) {
    console.error("Erro na rota ao atualizar último login:", error);
    return res.status(500).json({ error: "Erro ao atualizar último login." });
  }
});
  
  

export default router;
