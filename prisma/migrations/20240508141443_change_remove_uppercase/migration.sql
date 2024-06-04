/*
  Warnings:

  - You are about to drop the `TEC_BASEAPLICACAO` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TEC_CANAL` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TEC_ENDPOINT` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TEC_PARAMETRO` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TEC_PARAMETROBASEPLICACAO` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `USU_USUARIO` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `USU_USUARIOCANAL` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `USU_USUARIOENDPOINT` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TEC_CANAL" DROP CONSTRAINT "TEC_CANAL_TEC_BaseAplicacaoId_fkey";

-- DropForeignKey
ALTER TABLE "TEC_CANAL" DROP CONSTRAINT "TEC_CANAL_TEC_ParametroCodigoCliente_fkey";

-- DropForeignKey
ALTER TABLE "TEC_PARAMETROBASEPLICACAO" DROP CONSTRAINT "TEC_PARAMETROBASEPLICACAO_TEC_BaseAplicacaoId_fkey";

-- DropForeignKey
ALTER TABLE "TEC_PARAMETROBASEPLICACAO" DROP CONSTRAINT "TEC_PARAMETROBASEPLICACAO_TEC_ParametroCodigoCliente_fkey";

-- DropForeignKey
ALTER TABLE "USU_USUARIO" DROP CONSTRAINT "USU_USUARIO_TEC_BaseAplicacaoId_fkey";

-- DropForeignKey
ALTER TABLE "USU_USUARIO" DROP CONSTRAINT "USU_USUARIO_TEC_ParametroCodigoCliente_fkey";

-- DropForeignKey
ALTER TABLE "USU_USUARIOCANAL" DROP CONSTRAINT "USU_USUARIOCANAL_TEC_CanalId_fkey";

-- DropForeignKey
ALTER TABLE "USU_USUARIOCANAL" DROP CONSTRAINT "USU_USUARIOCANAL_USU_UsuarioId_fkey";

-- DropForeignKey
ALTER TABLE "USU_USUARIOENDPOINT" DROP CONSTRAINT "USU_USUARIOENDPOINT_TEC_EndpointId_fkey";

-- DropForeignKey
ALTER TABLE "USU_USUARIOENDPOINT" DROP CONSTRAINT "USU_USUARIOENDPOINT_USU_UsuarioId_fkey";

-- DropTable
DROP TABLE "TEC_BASEAPLICACAO";

-- DropTable
DROP TABLE "TEC_CANAL";

-- DropTable
DROP TABLE "TEC_ENDPOINT";

-- DropTable
DROP TABLE "TEC_PARAMETRO";

-- DropTable
DROP TABLE "TEC_PARAMETROBASEPLICACAO";

-- DropTable
DROP TABLE "USU_USUARIO";

-- DropTable
DROP TABLE "USU_USUARIOCANAL";

-- DropTable
DROP TABLE "USU_USUARIOENDPOINT";

-- CreateTable
CREATE TABLE "tec_endpoint" (
    "tec_endpoint_id" SERIAL NOT NULL,
    "tec_endpoint_name" TEXT NOT NULL,
    "tec_endpoint_p256dh" TEXT NOT NULL,
    "tec_endpoint_endpoint" TEXT NOT NULL,
    "tec_endpoint_auth" TEXT NOT NULL,
    "tec_endpoint_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tec_endpoint_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tec_endpoint_pkey" PRIMARY KEY ("tec_endpoint_id")
);

-- CreateTable
CREATE TABLE "tec_parametro" (
    "tec_parametro_codigo_cliente" INTEGER NOT NULL,
    "tec_parametro_nome_cliente" TEXT NOT NULL,
    "tec_parametro_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tec_parametro_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tec_parametro_pkey" PRIMARY KEY ("tec_parametro_codigo_cliente")
);

-- CreateTable
CREATE TABLE "tec_baseaplicacao" (
    "tec_baseaplicacao_id" INTEGER NOT NULL,
    "tec_baseaplicacao_nome" TEXT NOT NULL,
    "tec_baseaplicacao_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tec_baseaplicacao_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tec_baseaplicacao_pkey" PRIMARY KEY ("tec_baseaplicacao_id")
);

-- CreateTable
CREATE TABLE "tec_parametrobaseplicacao" (
    "tec_parametro_codigo_cliente" INTEGER NOT NULL,
    "tec_baseaplicacao_id" INTEGER NOT NULL,
    "tec_parametrobaseaplicacao_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tec_parametrobaseaplicacao_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tec_parametrobaseplicacao_pkey" PRIMARY KEY ("tec_parametro_codigo_cliente","tec_baseaplicacao_id")
);

-- CreateTable
CREATE TABLE "tec_canal" (
    "tec_canal_id" SERIAL NOT NULL,
    "tec_canal_nome" TEXT NOT NULL,
    "tec_parametro_codigo_cliente" INTEGER NOT NULL,
    "tec_baseaplicacao_id" INTEGER NOT NULL,
    "tec_canal_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tec_canal_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tec_canal_pkey" PRIMARY KEY ("tec_canal_id")
);

-- CreateTable
CREATE TABLE "usu_usuario" (
    "usu_usuario_id" SERIAL NOT NULL,
    "usu_usuario_tipo" TEXT NOT NULL,
    "usu_usuario_nome" TEXT NOT NULL,
    "usu_usuario_chave" TEXT NOT NULL,
    "tec_parametro_codigo_cliente" INTEGER NOT NULL,
    "tec_baseaplicacao_id" INTEGER NOT NULL,
    "usu_usuario_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usu_usuario_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usu_usuario_pkey" PRIMARY KEY ("usu_usuario_id")
);

-- CreateTable
CREATE TABLE "usu_usuariocanal" (
    "usu_usuario_id" INTEGER NOT NULL,
    "tec_canal_id" INTEGER NOT NULL,
    "usu_usuariocanal_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usu_usuariocanal_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usu_usuariocanal_pkey" PRIMARY KEY ("usu_usuario_id","tec_canal_id")
);

-- CreateTable
CREATE TABLE "usu_usuarioendpoint" (
    "usu_usuario_id" INTEGER NOT NULL,
    "tec_endpoint_id" INTEGER NOT NULL,
    "usu_usuarioendpoint_created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usu_usuarioendpoint_updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usu_usuarioendpoint_pkey" PRIMARY KEY ("usu_usuario_id","tec_endpoint_id")
);

-- AddForeignKey
ALTER TABLE "tec_parametrobaseplicacao" ADD CONSTRAINT "tec_parametrobaseplicacao_tec_parametro_codigo_cliente_fkey" FOREIGN KEY ("tec_parametro_codigo_cliente") REFERENCES "tec_parametro"("tec_parametro_codigo_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tec_parametrobaseplicacao" ADD CONSTRAINT "tec_parametrobaseplicacao_tec_baseaplicacao_id_fkey" FOREIGN KEY ("tec_baseaplicacao_id") REFERENCES "tec_baseaplicacao"("tec_baseaplicacao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tec_canal" ADD CONSTRAINT "tec_canal_tec_parametro_codigo_cliente_fkey" FOREIGN KEY ("tec_parametro_codigo_cliente") REFERENCES "tec_parametro"("tec_parametro_codigo_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tec_canal" ADD CONSTRAINT "tec_canal_tec_baseaplicacao_id_fkey" FOREIGN KEY ("tec_baseaplicacao_id") REFERENCES "tec_baseaplicacao"("tec_baseaplicacao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usu_usuario" ADD CONSTRAINT "usu_usuario_tec_parametro_codigo_cliente_fkey" FOREIGN KEY ("tec_parametro_codigo_cliente") REFERENCES "tec_parametro"("tec_parametro_codigo_cliente") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usu_usuario" ADD CONSTRAINT "usu_usuario_tec_baseaplicacao_id_fkey" FOREIGN KEY ("tec_baseaplicacao_id") REFERENCES "tec_baseaplicacao"("tec_baseaplicacao_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usu_usuariocanal" ADD CONSTRAINT "usu_usuariocanal_usu_usuario_id_fkey" FOREIGN KEY ("usu_usuario_id") REFERENCES "usu_usuario"("usu_usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usu_usuariocanal" ADD CONSTRAINT "usu_usuariocanal_tec_canal_id_fkey" FOREIGN KEY ("tec_canal_id") REFERENCES "tec_canal"("tec_canal_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usu_usuarioendpoint" ADD CONSTRAINT "usu_usuarioendpoint_usu_usuario_id_fkey" FOREIGN KEY ("usu_usuario_id") REFERENCES "usu_usuario"("usu_usuario_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usu_usuarioendpoint" ADD CONSTRAINT "usu_usuarioendpoint_tec_endpoint_id_fkey" FOREIGN KEY ("tec_endpoint_id") REFERENCES "tec_endpoint"("tec_endpoint_id") ON DELETE RESTRICT ON UPDATE CASCADE;
