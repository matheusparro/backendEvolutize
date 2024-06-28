import { PrismaClient, PSH_Endpoint } from '@prisma/client';
import AppError from '../errorException/AppError';
export default class PSH_EndpointService {
    private prismaClient: PrismaClient;

    constructor() {
        this.prismaClient = new PrismaClient();
    }

    async getEndpointByEndpoint(endpoint: string): Promise<PSH_Endpoint | null> {
        try {
            const endpointFound = await this.prismaClient.pSH_Endpoint.findFirst({
                where: {
                    PSH_EndpointEndpoint: endpoint,
                }
            });
            return endpointFound;
        } catch (error: any) {
            console.error('Erro ao buscar endpoint:', error.message);
            throw new AppError(500, 'Falha ao buscar endpoint.', 'ENDPOINT_FETCH_ERROR');
        }
    }

    async updateEndpointLastLogin(endpointId: number): Promise<void> {
        try {
            await this.prismaClient.pSH_Endpoint.update({
                where: {
                    PSH_EndpointId: endpointId,
                },
                data: {
                    PSH_EndpointUltimoLogin: new Date(),
                }
            });
        } catch (error: any) {
            console.error('Erro ao atualizar último login:', error.message);
            throw new AppError(500, 'Falha ao atualizar último login.', 'LAST_LOGIN_UPDATE_ERROR');
        }
    }
}
