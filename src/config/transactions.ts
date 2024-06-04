import { PrismaClient } from '@prisma/client';
import cls from 'cls-hooked';
import { PrismaClientManager } from '../dataBase/PrismaClientManager';
import { PrismaTransactionScope } from '../dataBase/PrismaTransactionScope';

// Criação do namespace para contexto de transação
const transactionContext = cls.createNamespace('transaction');

// Criação do cliente Prisma
const prisma = new PrismaClient();

// Inicialização do gerenciador de transação
const transactionScope = new PrismaTransactionScope(prisma, transactionContext);

// Inicialização do gerenciador de cliente Prisma
const clientManager = new PrismaClientManager(prisma, transactionContext);

// Exportação dos objetos para serem utilizados em outras partes do aplicativo
export { transactionScope, clientManager };
