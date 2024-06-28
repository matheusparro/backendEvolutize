import { NextFunction, Request, Response } from 'express';
import PSH_RegisterNotificationService from '../services/PSH_RegisterNotificationService';
import { PSH_USUARIODTO } from '../config/interface.models';
import { ISubscription } from '../commonInterfaces/interfaces';
import PSH_PermissionNotification from '../services/PSH_PermissionNotification';

export default class TEC_RegisterNotificationController {
  private registerNotificationService: PSH_RegisterNotificationService;
  private permissionService: PSH_PermissionNotification;

  constructor() {
    this.registerNotificationService = new PSH_RegisterNotificationService();
    this.permissionService = new PSH_PermissionNotification();
  }

  async registerNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const subscription: ISubscription = req.body.subscription;
      const psh_usuario: PSH_USUARIODTO = req.body.psh_usuario;
      if(!subscription || !psh_usuario){
        return next(new Error('Todos os parametros são obrigatórios: subscription, psh_usuario'));
      }
      await this.registerNotificationService.register(subscription, psh_usuario);
      res.status(201).send('Notification registered successfully.');
    } catch (error:any) {
      next(error)
    }
  }
}
