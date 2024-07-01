import { PrismaClient } from '@prisma/client';
import AppError from '../errorException/AppError';
export default class PSH_PermissaoNotificacao {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    public async verify(TEC_ClienteCodigo: number, TEC_AplicacaoId: number): Promise<void> {
        try {
            if (!TEC_ClienteCodigo || !TEC_AplicacaoId) {
                throw new AppError(400, 'Cliente e Aplicação são obrigatórios.', 'CLIENT_APP_REQUIRED');
            }
            const verify = await this.prismaClient.tEC_ClienteAplicacao.findFirst({
                where: {
                    TEC_ClienteCodigo: TEC_ClienteCodigo,
                    TEC_AplicacaoId: TEC_AplicacaoId,
                }
            });
            if (!verify) {
                throw new AppError(404, 'Cliente/Aplicação não possuem permissão de envio de notificação.', 'CLIENT_APP_NOT_FOUND');
            }
        } catch (error: any) {
            throw new AppError(500, 'Falha ao verificar permissão de envio de notificação.', 'PERMISSION_ERROR');
        }
    }
}
