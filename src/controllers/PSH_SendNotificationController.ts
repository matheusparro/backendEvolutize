import { NextFunction, Request, Response } from 'express';
import PSH_SendNotificationService from '../services/PSH_SendNotificationService';
import { IPushMessage } from '../commonInterfaces/interfaces';
import AppError from '../errorException/AppError';
import SuccessResponse from '../SucessMessages/SuccessResponse';
import PSH_PermissionNotification from '../services/PSH_PermissionNotification';

// Interface para os dados da mensagem de push


const sendNotificationService = new PSH_SendNotificationService();
const permissionService = new PSH_PermissionNotification();

export default class PSH_SendNotificationController {
  // Método para enviar notificações push
  async sendPushNotification(req: Request, res: Response, next:NextFunction) {
    const { users, TEC_ClienteCodigo, TEC_AplicacaoId, message, hashExterno }: IPushMessage = req.body;
    await permissionService.verify(TEC_ClienteCodigo, TEC_AplicacaoId);
    // Validação dos parâmetros da requisição
    if (!users || !TEC_ClienteCodigo || !TEC_AplicacaoId || !message || !hashExterno) {
      return next(new AppError(400, 'Todos os parâmetros são obrigatórios: users, TEC_ClienteCodigo, TEC_AplicacaoId, message, hashExterno', 'MISSING_PARAMETERS'));
    }

    try {
      // Dispara o processamento em background sem esperar o resultado
      sendNotificationService.sendNotifications({ users, TEC_ClienteCodigo, TEC_AplicacaoId, message,hashExterno })
        .then(() => {
          console.log('Notificações processadas em background.');
        })
        .catch((error) => {
          console.error("Erro ao processar notificações em background:", error);
        });

        const response = SuccessResponse.create(null, 'Notificações sendo processadas em background.');
        return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}


