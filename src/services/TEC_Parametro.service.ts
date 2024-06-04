import { Prisma, TEC_PARAMETRO } from '@prisma/client';
import { TEC_PARAMETRODTO } from '../config/interface.models';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { TransactionScope } from '../shared/TransactionScope';

export default class TEC_ParametroService {
  private readonly clientManager: PrismaClientManager;
  private readonly transactionScope: TransactionScope;
  private prisma: Prisma.TransactionClient;

  constructor(transactionScope: TransactionScope, clientManager: PrismaClientManager) {
    this.clientManager = clientManager;
    this.transactionScope = transactionScope;
    this.prisma = clientManager.getClient();
  }

  async createTecParametro(novoParametro: TEC_PARAMETRODTO) {
    try {
      return await this.prisma.tEC_PARAMETRO.create({
        data: novoParametro,
      });
    } catch (error:any) {
      throw new Error(`Erro ao criar parâmetro: ${error.message}`);
    }
  }

  async getAllTecParametros() {
    try {
      return await this.prisma.tEC_PARAMETRO.findMany();
    } catch (error:any) {
      throw new Error(`Erro ao buscar todos os parâmetros: ${error.message}`);
    }
  }

  async getTecParametroById(id: number) {
    try {
      return await this.prisma.tEC_PARAMETRO.findUnique({
        where: { TEC_ParametroCodigoCliente: id },
      });
    } catch (error:any) {
      throw new Error(`Erro ao buscar parâmetro por ID: ${error.message}`);
    }
  }

  async updateTecParametro(id: number, novoParametro: TEC_PARAMETRO) {
    try {
      return await this.prisma.tEC_PARAMETRO.update({
        where: { TEC_ParametroCodigoCliente: id },
        data: novoParametro,
      });
    } catch (error:any) {
      throw new Error(`Erro ao atualizar parâmetro: ${error.message}`);
    }
  }

  async deleteTecParametro(id: number) {
    try {
      return await this.prisma.tEC_PARAMETRO.delete({
        where: { TEC_ParametroCodigoCliente: id },
      });
    } catch (error:any) {
      throw new Error(`Erro ao deletar parâmetro: ${error.message}`);
    }
  }

  async sync(tec_parametroall: any, firstSync: boolean, finalSync: boolean) {
    try {
      const prisma = this.clientManager.getClient();
      await this.transactionScope.run(async () => {
        if (firstSync) {
          await prisma.tEC_PARAMETRO.updateMany({ data: { Eliminar: true } });
        }

        for (const tec_parametro of tec_parametroall) {
          const tec_parametroFind = await prisma.tEC_PARAMETRO.findFirst({
            where: {
              TEC_ParametroCodigoCliente: tec_parametro.TEC_ParametroCodigoCliente,
            },
          });
          if (!tec_parametroFind) {
            const tec_parametroCreate = await prisma.tEC_PARAMETRO.create({
              data: {
                TEC_ParametroCodigoCliente: tec_parametro.TEC_ParametroCodigoCliente,
                TEC_ParametroNomeCliente: tec_parametro.TEC_ParametroNomeCliente,
              },
            });
          } else {
            await prisma.tEC_PARAMETRO.update({
              where: {
                TEC_ParametroCodigoCliente: tec_parametro.TEC_ParametroCodigoCliente,
              },
              data: {
                TEC_ParametroNomeCliente: tec_parametro.TEC_ParametroNomeCliente,
                Eliminar: false,
              },
            });
          }
        }
        if (finalSync) {
          await prisma.tEC_PARAMETRO.deleteMany({ where: { Eliminar: true } });
        }
      });
    } catch (error:any) {
      throw new Error(`Erro durante a sincronização: ${error.message}`);
    }
  }

  async getTecParametroByClientCode(clientCode: number): Promise<TEC_PARAMETRO | null> {
    try {
      return await this.prisma.tEC_PARAMETRO.findUnique({
        where: {
          TEC_ParametroCodigoCliente: clientCode,
        },
      });
    } catch (error:any) {
      throw new Error(`Erro ao buscar parâmetro pelo código do cliente: ${error.message}`);
    }
  }
}
