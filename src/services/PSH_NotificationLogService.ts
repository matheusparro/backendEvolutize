import { PSH_NotificacaoLog, PrismaClient } from "@prisma/client";

interface IPushMessage {
    message:{
      icon: string,
      title: string,
      body: string,
      url: string,
    }
    users: string[]
    TEC_ClienteCodigo:string,
    TEC_AplicacaoId: number
  }
export default class PSH_NotificationLogService {

    async createNotificationLog(body: IPushMessage): Promise<PSH_NotificacaoLog> {
        try {
            const prismaClient = new PrismaClient();
            const notificationPayload = JSON.stringify({
                icon: body.message.icon,
                title: body.message.title,
                body: body.message.body,
                url: body.message.url,
            });

            const logNotificacao = await prismaClient.pSH_NotificacaoLog.create({
                data: {
                    PSH_NotificacaoLogCreatedAt: new Date(),
                    PSH_NotificacaoLogBody: notificationPayload,
                    PSH_NotificacaoLogIcon: body.message.icon,
                    PSH_NotificacaoLogStatus: 'S',
                    PSH_NotificacaoLogTitle: body.message.title,
                    PSH_NotificacaoLogUpdatedAt: new Date(),
                    PSH_NotificacaoLogUrl: body.message.url,
                    TEC_AplicacaoId: body.TEC_AplicacaoId,
                    TEC_ClienteCodigo: body.TEC_ClienteCodigo
                },
            });

            return logNotificacao;
        } catch (error: any) {
            throw new Error('Falha ao criar log de notificação.');
        }
    }
}