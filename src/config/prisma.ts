import { PrismaClient } from '@prisma/client';
import * as cls from 'cls-hooked';
import { PrismaTransactionScope } from '../dataBase/PrismaTransactionScope';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
// Criando e exportando uma instância do PrismaClient
const prisma2 = new PrismaClient();

const transactionContext = cls.createNamespace('transaction');
const transactionScope = new PrismaTransactionScope(prisma2, transactionContext);
const clientManager = new PrismaClientManager(prisma2, transactionContext);
const prisma = clientManager.getClient()
export { prisma, transactionContext, transactionScope, clientManager };
