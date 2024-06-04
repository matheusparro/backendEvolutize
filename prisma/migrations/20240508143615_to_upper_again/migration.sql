/*
  Warnings:

  - You are about to drop the `tec_baseaplicacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tec_canal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tec_endpoint` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tec_parametro` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tec_parametrobaseplicacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usu_usuario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usu_usuariocanal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usu_usuarioendpoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tec_canal" DROP CONSTRAINT "tec_canal_tec_baseaplicacao_id_fkey";

-- DropForeignKey
ALTER TABLE "tec_canal" DROP CONSTRAINT "tec_canal_tec_parametro_codigo_cliente_fkey";

-- DropForeignKey
ALTER TABLE "tec_parametrobaseplicacao" DROP CONSTRAINT "tec_parametrobaseplicacao_tec_baseaplicacao_id_fkey";

-- DropForeignKey
ALTER TABLE "tec_parametrobaseplicacao" DROP CONSTRAINT "tec_parametrobaseplicacao_tec_parametro_codigo_cliente_fkey";

-- DropForeignKey
ALTER TABLE "usu_usuario" DROP CONSTRAINT "usu_usuario_tec_baseaplicacao_id_fkey";

-- DropForeignKey
ALTER TABLE "usu_usuario" DROP CONSTRAINT "usu_usuario_tec_parametro_codigo_cliente_fkey";

-- DropForeignKey
ALTER TABLE "usu_usuariocanal" DROP CONSTRAINT "usu_usuariocanal_tec_canal_id_fkey";

-- DropForeignKey
ALTER TABLE "usu_usuariocanal" DROP CONSTRAINT "usu_usuariocanal_usu_usuario_id_fkey";

-- DropForeignKey
ALTER TABLE "usu_usuarioendpoint" DROP CONSTRAINT "usu_usuarioendpoint_tec_endpoint_id_fkey";

-- DropForeignKey
ALTER TABLE "usu_usuarioendpoint" DROP CONSTRAINT "usu_usuarioendpoint_usu_usuario_id_fkey";

-- DropTable
DROP TABLE "tec_baseaplicacao";

-- DropTable
DROP TABLE "tec_canal";

-- DropTable
DROP TABLE "tec_endpoint";

-- DropTable
DROP TABLE "tec_parametro";

-- DropTable
DROP TABLE "tec_parametrobaseplicacao";

-- DropTable
DROP TABLE "usu_usuario";

-- DropTable
DROP TABLE "usu_usuariocanal";

-- DropTable
DROP TABLE "usu_usuarioendpoint";

-- CreateTable
CREATE TABLE "TEC_ENDPOINT" (
    "TEC_EndpointId" SERIAL NOT NULL,
    "TEC_EndpointName" TEXT NOT NULL,
    "TEC_EndpointP256dh" TEXT NOT NULL,
    "TEC_EndpointEndpoint" TEXT NOT NULL,
    "TEC_EndpointAuth" TEXT NOT NULL,
    "TEC_EndpointCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TEC_EndpointUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TEC_ENDPOINT_pkey" PRIMARY KEY ("TEC_EndpointId")
);

-- CreateTable
CREATE TABLE "TEC_PARAMETRO" (
    "TEC_ParametroCodigoCliente" INTEGER NOT NULL,
    "TEC_ParametroNomeCliente" TEXT NOT NULL,
    "TEC_ParametroCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TEC_ParametroUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TEC_PARAMETRO_pkey" PRIMARY KEY ("TEC_ParametroCodigoCliente")
);

-- CreateTable
CREATE TABLE "TEC_BASEAPLICACAO" (
    "TEC_BaseAplicacaoId" INTEGER NOT NULL,
    "TEC_BaseAplicacaoNome" TEXT NOT NULL,
    "TEC_BaseAplicacaoCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TEC_BaseAplicacaoUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TEC_BASEAPLICACAO_pkey" PRIMARY KEY ("TEC_BaseAplicacaoId")
);

-- CreateTable
CREATE TABLE "TEC_PARAMETROBASEPLICACAO" (
    "TEC_ParametroCodigoCliente" INTEGER NOT NULL,
    "TEC_BaseAplicacaoId" INTEGER NOT NULL,
    "TEC_ParametroBaseAplicacaoCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TEC_ParametroBaseAplicacaoUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TEC_PARAMETROBASEPLICACAO_pkey" PRIMARY KEY ("TEC_ParametroCodigoCliente","TEC_BaseAplicacaoId")
);

-- CreateTable
CREATE TABLE "TEC_CANAL" (
    "TEC_CanalId" SERIAL NOT NULL,
    "TEC_CanalNome" TEXT NOT NULL,
    "TEC_ParametroCodigoCliente" INTEGER NOT NULL,
    "TEC_BaseAplicacaoId" INTEGER NOT NULL,
    "TEC_CanalCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TEC_CanalUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TEC_CANAL_pkey" PRIMARY KEY ("TEC_CanalId")
);

-- CreateTable
CREATE TABLE "USU_USUARIO" (
    "USU_UsuarioId" SERIAL NOT NULL,
    "USU_UsuarioTipo" TEXT NOT NULL,
    "USU_UsuarioNome" TEXT NOT NULL,
    "USU_UsuarioChave" TEXT NOT NULL,
    "TEC_ParametroCodigoCliente" INTEGER NOT NULL,
    "TEC_BaseAplicacaoId" INTEGER NOT NULL,
    "USU_UsuarioCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "USU_UsuarioUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "USU_USUARIO_pkey" PRIMARY KEY ("USU_UsuarioId")
);

-- CreateTable
CREATE TABLE "USU_USUARIOCANAL" (
    "USU_UsuarioId" INTEGER NOT NULL,
    "TEC_CanalId" INTEGER NOT NULL,
    "USU_UsuarioCanalCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "USU_UsuarioCanalUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "USU_USUARIOCANAL_pkey" PRIMARY KEY ("USU_UsuarioId","TEC_CanalId")
);

-- CreateTable
CREATE TABLE "USU_USUARIOENDPOINT" (
    "USU_UsuarioId" INTEGER NOT NULL,
    "TEC_EndpointId" INTEGER NOT NULL,
    "USU_UsuarioEndpointCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "USU_UsuarioEndpointUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "USU_USUARIOENDPOINT_pkey" PRIMARY KEY ("USU_UsuarioId","TEC_EndpointId")
);

-- AddForeignKey
ALTER TABLE "TEC_PARAMETROBASEPLICACAO" ADD CONSTRAINT "TEC_PARAMETROBASEPLICACAO_TEC_ParametroCodigoCliente_fkey" FOREIGN KEY ("TEC_ParametroCodigoCliente") REFERENCES "TEC_PARAMETRO"("TEC_ParametroCodigoCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TEC_PARAMETROBASEPLICACAO" ADD CONSTRAINT "TEC_PARAMETROBASEPLICACAO_TEC_BaseAplicacaoId_fkey" FOREIGN KEY ("TEC_BaseAplicacaoId") REFERENCES "TEC_BASEAPLICACAO"("TEC_BaseAplicacaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TEC_CANAL" ADD CONSTRAINT "TEC_CANAL_TEC_ParametroCodigoCliente_fkey" FOREIGN KEY ("TEC_ParametroCodigoCliente") REFERENCES "TEC_PARAMETRO"("TEC_ParametroCodigoCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TEC_CANAL" ADD CONSTRAINT "TEC_CANAL_TEC_BaseAplicacaoId_fkey" FOREIGN KEY ("TEC_BaseAplicacaoId") REFERENCES "TEC_BASEAPLICACAO"("TEC_BaseAplicacaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIO" ADD CONSTRAINT "USU_USUARIO_TEC_ParametroCodigoCliente_fkey" FOREIGN KEY ("TEC_ParametroCodigoCliente") REFERENCES "TEC_PARAMETRO"("TEC_ParametroCodigoCliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIO" ADD CONSTRAINT "USU_USUARIO_TEC_BaseAplicacaoId_fkey" FOREIGN KEY ("TEC_BaseAplicacaoId") REFERENCES "TEC_BASEAPLICACAO"("TEC_BaseAplicacaoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIOCANAL" ADD CONSTRAINT "USU_USUARIOCANAL_USU_UsuarioId_fkey" FOREIGN KEY ("USU_UsuarioId") REFERENCES "USU_USUARIO"("USU_UsuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIOCANAL" ADD CONSTRAINT "USU_USUARIOCANAL_TEC_CanalId_fkey" FOREIGN KEY ("TEC_CanalId") REFERENCES "TEC_CANAL"("TEC_CanalId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIOENDPOINT" ADD CONSTRAINT "USU_USUARIOENDPOINT_USU_UsuarioId_fkey" FOREIGN KEY ("USU_UsuarioId") REFERENCES "USU_USUARIO"("USU_UsuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIOENDPOINT" ADD CONSTRAINT "USU_USUARIOENDPOINT_TEC_EndpointId_fkey" FOREIGN KEY ("TEC_EndpointId") REFERENCES "TEC_ENDPOINT"("TEC_EndpointId") ON DELETE RESTRICT ON UPDATE CASCADE;