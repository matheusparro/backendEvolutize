import express, { Request, Response } from 'express';
import TEC_RegisterNotificationController from '../controllers/TEC_RegisterNotification.controller';
import {clientManager,transactionScope} from '../config/transactions'
import USU_UsuarioService from '../services/USU_Usuario.service';
import TEC_EndpointService from '../services/TEC_Endpoint.service';
import USU_UsuarioEndpointService from '../services/USU_UsuarioEndpoint.service';
import TEC_RegisterNotification from '../services/TEC_RegisterNotification.service';
const router = express.Router();

const usuUsuarioService = new USU_UsuarioService(transactionScope, clientManager); // Instancie o serviço de usuário conforme necessário
const tecEndpointService = new TEC_EndpointService(transactionScope, clientManager); // Instancie o serviço de endpoint conforme necessário
const usuUsuarioEndpointService = new USU_UsuarioEndpointService(transactionScope, clientManager); // Instancie o serviço de usuário de endpoint conforme necessário
const tec_registerNotificationService = new TEC_RegisterNotification(transactionScope, clientManager, usuUsuarioService, tecEndpointService, usuUsuarioEndpointService); // Instancie o serviço de registro de notificação conforme necessário
const tec_registerNotification = new TEC_RegisterNotificationController(
    tec_registerNotificationService
);

router.post('/notification/push/register', async (request: Request, response: Response) => {
  try {
    await tec_registerNotification.registerNotification(request, response);
    return response.status(201);
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return response.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

export default router;
