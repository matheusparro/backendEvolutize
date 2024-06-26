import { PrismaClient, PSH_Endpoint } from '@prisma/client';

export default class PSH_EndpointService {

    async getEndpointByEndpoint(endpoint:string): Promise<PSH_Endpoint |  null> {
        try {
            const prismaClient = new PrismaClient();
            const endpointFound = await prismaClient.pSH_Endpoint.findFirst({
                where: {
                    PSH_EndpointEndpoint: endpoint,
                }
            });
            return endpointFound;
        } catch (error: any) {
            console.error('Erro ao criar endpoint:', error.message);
            // Trate o erro de acordo com a necessidade da sua aplicação,
            // como logá-lo, notificar o usuário, etc.
            throw new Error('Falha ao criar endpoint.');
        }
    }
    async updateEndpointLastLogin(endpointId: number): Promise<void> {
        try {
            const prismaClient = new PrismaClient();
            await prismaClient.pSH_Endpoint.update({
                where: {
                    PSH_EndpointId: endpointId,
                },
                data: {
                    PSH_EndpointUltimoLogin: new Date(),
                }
            });
        } catch (error: any) {
            console.error('Erro ao atualizar último login:', error.message);
            // Trate o erro de acordo com a necessidade da sua aplicação,
            // como logá-lo, notificar o usuário, etc.
            throw new Error('Falha ao atualizar último login.');
        }
    }
    
}
