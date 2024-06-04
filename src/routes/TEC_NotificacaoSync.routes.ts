import express, { Request, Response } from 'express';
import TEC_NotificationSyncController from '../controllers/TEC_NotificacaoSyncs.controller';
import TEC_NotificationSync from '../services/TEC_NotificationSync.service';
import { clientManager, transactionScope } from '../config/transactions'; // Importando do arquivo de configuração
import TEC_BaseAplicacaoService from '../services/TEC_BaseAplicacao.service';
import TEC_ParametroService from '../services/TEC_Parametro.service';
import TEC_ParametroBaseAplicacaoService from '../services/TEC_ParametroBaseAplicacao.service';

const router = express.Router();
const baseAplicacaoService = new TEC_BaseAplicacaoService(transactionScope, clientManager);
const parametroService = new TEC_ParametroService(transactionScope, clientManager);
const parametroBaseAplicacaoService = new TEC_ParametroBaseAplicacaoService(transactionScope, clientManager);
const notificationSyncService = new TEC_NotificationSync(transactionScope, clientManager, baseAplicacaoService, parametroService, parametroBaseAplicacaoService);
const notificationSyncController = new TEC_NotificationSyncController(notificationSyncService);

router.post('/notification/tec_parametrobaseaplicacao/sync', async (req: Request, res: Response) => {
  try {
    await notificationSyncController.syncAll(req, res);
  } catch (error:any) {
    console.error("Erro durante a sincronização das notificações:", error);
    res.status(500).json({ error: `Erro durante a sincronização das notificações, ${error.message}` });
  }
});

export default router;
