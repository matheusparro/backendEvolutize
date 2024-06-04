import { TEC_ENDPOINTDTO } from '../config/interface.models';
import { Prisma, TEC_ENDPOINT } from '@prisma/client';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { TransactionScope } from '../shared/TransactionScope';

export default class TEC_EndpointService {
  private readonly clientManager: PrismaClientManager;
  private readonly transactionScope: TransactionScope;
  private prisma: Prisma.TransactionClient;

  constructor(transactionScope: TransactionScope, clientManager: PrismaClientManager) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
    this.prisma = clientManager.getClient();
  }
  
  async createEndpoint(endpointData: TEC_ENDPOINTDTO): Promise<TEC_ENDPOINT> {
    try {
      let resultadoTransacao: TEC_ENDPOINT | undefined;
      
      // Execute a criação dentro da transação usando a TransactionScope
      await this.transactionScope.run(async () => {
        // Mapeie os dados do DTO para o formato esperado pelo Prisma
        const prisma = this.clientManager.getClient();
        const prismaEndpointData = {
          TEC_EndpointName: endpointData.TEC_EndpointName,
          TEC_EndpointP256dh: endpointData.TEC_EndpointP256dh,
          TEC_EndpointEndpoint: endpointData.TEC_EndpointEndpoint,
          TEC_EndpointAuth: endpointData.TEC_EndpointAuth,
        };
  
        // Crie o endpoint usando o Prisma e atribua o resultado à variável
        resultadoTransacao = await prisma.tEC_ENDPOINT.create({
          data: prismaEndpointData,
        });
      });
  
      // Retorne o resultado da transação após a execução da transação
      if (resultadoTransacao) {
        return resultadoTransacao;
      } else {
        throw new Error('Falha ao criar endpoint.');
      }
    } catch (error: any) {
      console.error('Erro ao criar endpoint:', error);
      throw new Error('Falha ao criar endpoint.');
    }
  }

  async getAllEndpoints(): Promise<TEC_ENDPOINT[]> {
    try {
      return await this.prisma.tEC_ENDPOINT.findMany();
    } catch (error: any) {
      console.error('Erro ao obter todos os endpoints:', error);
      throw new Error('Falha ao buscar dados do endpoint.');
    }
  }

  async getEndpointById(id: number): Promise<TEC_ENDPOINT | null> {
    try {
      return await this.prisma.tEC_ENDPOINT.findUnique({
        where: { TEC_EndpointId: id },
      });
    } catch (error: any) {
      console.error('Erro ao obter endpoint por ID:', error);
      throw new Error('Falha ao buscar endpoint por ID.');
    }
  }

  async getEndpointByEndpoint(endpoint: string): Promise<TEC_ENDPOINT | null> {
    try {
      return await this.prisma.tEC_ENDPOINT.findFirst({
        where: {
          TEC_EndpointEndpoint: endpoint,
        },
      });
    } catch (error: any) {
      console.error('Erro ao obter endpoint por endpoint:', error);
      throw new Error('Falha ao buscar endpoint por endpoint.');
    }
  }

  async updateEndpoint(id: number): Promise<TEC_ENDPOINT | null> {
    try {
      return await this.prisma.tEC_ENDPOINT.update({
        where: { TEC_EndpointId: id },
        data: {
          UpdatedAt: new Date(),
        },
      });
    } catch (error: any) {
      console.error('Erro ao atualizar endpoint:', error);
      throw new Error('Falha ao atualizar endpoint.');
    }
  }

  async deleteEndpoint(id: number): Promise<TEC_ENDPOINT | null> {
    try {
      return await this.prisma.tEC_ENDPOINT.delete({
        where: { TEC_EndpointId: id },
      });
    } catch (error: any) {
      console.error('Erro ao deletar endpoint:', error);
      throw new Error('Falha ao deletar endpoint.');
    }
  }
}
