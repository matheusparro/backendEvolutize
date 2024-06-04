import { Request, Response } from 'express';
import TEC_RegisterNotification from '../services/TEC_RegisterNotification.service';

import { USU_USUARIODTO } from '../config/interface.models';
import { ISubscription } from '../server';

export default class TEC_RegisterNotificationController {
  private registerNotificationService: TEC_RegisterNotification;
  constructor(
    registerNotificationService: TEC_RegisterNotification,
  ) {
    this.registerNotificationService = registerNotificationService;
  }

  async registerNotification(req: Request, res: Response): Promise<void> {
    try {
      const subscription: ISubscription = req.body.subscription;
      const usuUsuario: USU_USUARIODTO = req.body.usu_usuario;

      await this.registerNotificationService.register(subscription, usuUsuario);
      res.status(201).send('Notification registered successfully.');
    } catch (error) {
      console.error('Error registering notification:', error);
      res.status(500).send({error:'Falha ao registrar usuário/endpoint.'});
    }
  }
}
