import { TEC_PARAMETROBASEPLICACAODTO } from '../config/interface.models';
import { Prisma, TEC_PARAMETROBASEPLICACAO } from '@prisma/client';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { TransactionScope } from '../shared/TransactionScope';

export default class TEC_ParametroBaseAplicacaoService {
  private readonly clientManager: PrismaClientManager;
  private readonly transactionScope: TransactionScope;
  private prisma: Prisma.TransactionClient;

  constructor(transactionScope: TransactionScope, clientManager: PrismaClientManager) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
    this.prisma = clientManager.getClient();
  }

  async create(parametroBaseAplicacao: TEC_PARAMETROBASEPLICACAODTO): Promise<TEC_PARAMETROBASEPLICACAO | null> {
    try {
      return await this.prisma.tEC_PARAMETROBASEPLICACAO.create({
        data: parametroBaseAplicacao,
      });
    } catch (error: any) {
      console.error('Erro ao criar TecParametroBaseAplicacao:', error);
      throw new Error('Falha ao criar TecParametroBaseAplicacao.');
    }
  }

  async getAll(): Promise<TEC_PARAMETROBASEPLICACAO[]> {
    try {
      return await this.prisma.tEC_PARAMETROBASEPLICACAO.findMany();
    } catch (error: any) {
      console.error('Erro ao obter todos TecParametroBaseAplicacao:', error);
      throw new Error('Falha ao buscar dados de TecParametroBaseAplicacao.');
    }
  }

  async getById(parametroCodigoCliente: number, baseAplicacaoId: number): Promise<TEC_PARAMETROBASEPLICACAO | null> {
    try {
      return await this.prisma.tEC_PARAMETROBASEPLICACAO.findUnique({
        where: { TEC_ParametroCodigoCliente_TEC_BaseAplicacaoId: { TEC_ParametroCodigoCliente: parametroCodigoCliente, TEC_BaseAplicacaoId: baseAplicacaoId } },
      });
    } catch (error: any) {
      console.error('Erro ao buscar TecParametroBaseAplicacao por IDs:', error);
      throw new Error('Erro ao buscar TecParametroBaseAplicacao por IDs.');
    }
  }

  async delete(parametroCodigoCliente: number, baseAplicacaoId: number): Promise<TEC_PARAMETROBASEPLICACAO | null> {
    try {
      return await this.prisma.tEC_PARAMETROBASEPLICACAO.delete({
        where: { TEC_ParametroCodigoCliente_TEC_BaseAplicacaoId: { TEC_ParametroCodigoCliente: parametroCodigoCliente, TEC_BaseAplicacaoId: baseAplicacaoId } },
      });
    } catch (error: any) {
      console.error('Erro ao deletar TecParametroBaseAplicacao:', error);
      throw new Error('Falha ao deletar TecParametroBaseAplicacao.');
    }
  }

  async sync(TEC_ParametroBaseAplicacaoAll: any) {
    const prisma = this.clientManager.getClient();
    for (const TEC_ParametroBaseAplicacao of TEC_ParametroBaseAplicacaoAll) {
      try {
        const finded = await prisma.tEC_PARAMETROBASEPLICACAO.findUnique({
          where: { TEC_ParametroCodigoCliente_TEC_BaseAplicacaoId: { TEC_ParametroCodigoCliente: TEC_ParametroBaseAplicacao.TEC_ParametroCodigoCliente, TEC_BaseAplicacaoId: TEC_ParametroBaseAplicacao.TEC_BaseAplicacaoId } },
        });
        if (!finded) {
          await this.transactionScope.run(async () => {
            await prisma.tEC_PARAMETROBASEPLICACAO.create({
              data: TEC_ParametroBaseAplicacao,
            });
          });
        }
      } catch (error: any) {
        console.error('Erro durante a sincronização:', error);
        throw new Error('Erro durante a sincronização.');
      }
    }
  }
}
