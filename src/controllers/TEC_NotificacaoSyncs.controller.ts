import { Request, Response } from 'express';
import TEC_NotificationSync from '../services/TEC_NotificationSync.service';

export default class TEC_NotificationSyncController {
  private readonly notificationSyncService: TEC_NotificationSync;

  constructor(notificationSyncService: TEC_NotificationSync) {
    this.notificationSyncService = notificationSyncService;
  }

  async syncAll(req: Request, res: Response): Promise<void> {
    try {
      const { TEC_BaseAplicacaoAll, TEC_ParametroAll, TEC_ParametroBaseAplicacaoAll, firstSync, lastSync } = req.body;
      await this.notificationSyncService.syncAll(TEC_BaseAplicacaoAll, TEC_ParametroAll, TEC_ParametroBaseAplicacaoAll, firstSync, lastSync);
      res.status(200).json("Sincronização concluída com sucesso.");
    } catch (error) {
      console.error("Erro durante a sincronização das notificações:", error);
      res.status(500).json({ error: "Erro durante a sincronização das notificações." });
    }
  }
}
