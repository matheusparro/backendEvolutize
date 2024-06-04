import { Prisma, PrismaClient, TEC_BASEAPLICACAO } from '@prisma/client';
import { TEC_BASEAPLICACAODTO } from '../config/interface.models';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { TransactionScope } from '../shared/TransactionScope';

export default class TEC_BaseAplicacaoService {
  private readonly clientManager: PrismaClientManager;
  private readonly transactionScope: TransactionScope;
  private prisma: Prisma.TransactionClient;

  constructor(transactionScope: TransactionScope, clientManager: PrismaClientManager) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
    this.prisma = clientManager.getClient();
  }

  async createTecBaseAplicacao(baseAplicacao: TEC_BASEAPLICACAODTO): Promise<TEC_BASEAPLICACAO> {
    try {
      return await this.prisma.tEC_BASEAPLICACAO.create({
        data: baseAplicacao,
      });
    } catch (error: any) {
      throw new Error(`Erro ao criar base de aplicação: ${error.message}`);
    }
  }

  async getAllTecBaseAplicacoes(): Promise<TEC_BASEAPLICACAO[]> {
    try {
      return await this.prisma.tEC_BASEAPLICACAO.findMany();
    } catch (error: any) {
      throw new Error(`Erro ao buscar todas as bases de aplicação: ${error.message}`);
    }
  }

  async getTecBaseAplicacaoById(id: number): Promise<TEC_BASEAPLICACAO | null> {
    try {
      return await this.prisma.tEC_BASEAPLICACAO.findUnique({
        where: {
          TEC_BaseAplicacaoId: id,
        },
      });
    } catch (error: any) {
      throw new Error(`Erro ao buscar base de aplicação por ID: ${error.message}`);
    }
  }

  async updateTecBaseAplicacao(id: number, newBaseAplicacao: TEC_BASEAPLICACAO): Promise<TEC_BASEAPLICACAO | null> {
    try {
      return await this.prisma.tEC_BASEAPLICACAO.update({
        where: {
          TEC_BaseAplicacaoId: id,
        },
        data: newBaseAplicacao,
      });
    } catch (error: any) {
      throw new Error(`Erro ao atualizar base de aplicação: ${error.message}`);
    }
  }

  async deleteTecBaseAplicacao(id: number): Promise<void> {
    try {
      await this.prisma.tEC_BASEAPLICACAO.delete({
        where: {
          TEC_BaseAplicacaoId: id,
        },
      });
    } catch (error: any) {
      throw new Error(`Erro ao deletar base de aplicação: ${error.message}`);
    }
  }

  async sync(tec_baseaplicacaoAll: any, firstSync: boolean, finalSync: boolean) {
    const prisma = this.clientManager.getClient();
    try {
      if (firstSync) {
        await prisma.tEC_BASEAPLICACAO.updateMany({ data: { Eliminar: true } });
      }

      for (const tec_baseaplicacao of tec_baseaplicacaoAll) {
        const tec_baseaplicacaoFinded = await prisma.tEC_BASEAPLICACAO.findUnique({
          where: {
            TEC_BaseAplicacaoId: tec_baseaplicacao.TEC_BaseAplicacaoId,
          },
        });

        if (!tec_baseaplicacaoFinded) {
          await prisma.tEC_BASEAPLICACAO.create({
            data: {
              TEC_BaseAplicacaoId: tec_baseaplicacao.TEC_BaseAplicacaoId,
              TEC_BaseAplicacaoNome: tec_baseaplicacao.TEC_BaseAplicacaoNome,
            },
          });
        } else {
          await prisma.tEC_BASEAPLICACAO.update({
            where: {
              TEC_BaseAplicacaoId: tec_baseaplicacao.TEC_BaseAplicacaoId,
            },
            data: {
              TEC_BaseAplicacaoNome: tec_baseaplicacao.TEC_BaseAplicacaoNome,
              Eliminar: false,
            },
          });
        }
      }

      if (finalSync) {
        await prisma.tEC_BASEAPLICACAO.deleteMany({ where: { Eliminar: true } });
      }
    } catch (error: any) {
      throw new Error(`Erro durante a sincronização de bases de aplicação: ${error.message}`);
    }
  }
}
