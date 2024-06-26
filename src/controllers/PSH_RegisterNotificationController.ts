import { Request, Response } from 'express';
import PSH_RegisterNotificationService from '../services/PSH_RegisterNotificationService';
import { PSH_USUARIODTO } from '../config/interface.models';
import { ISubscription } from '../server';

export default class TEC_RegisterNotificationController {
  private registerNotificationService: PSH_RegisterNotificationService;

  constructor() {
    this.registerNotificationService = new PSH_RegisterNotificationService();
  }

  async registerNotification(req: Request, res: Response): Promise<void> {
    try {
      const subscription: ISubscription = req.body.subscription;
      const psh_usuario: PSH_USUARIODTO = req.body.psh_usuario;
    


      await this.registerNotificationService.register(subscription, psh_usuario);
      res.status(201).send('Notification registered successfully.');
    } catch (error:any) {
      console.error('Error registering notification:', error);
      res.status(500).send({ error: 'Falha ao registrar usuário/endpoint.' });
    }
  }
}
