/*
  Warnings:

  - You are about to drop the column `TEC_BaseAplicacaoCreatedAt` on the `TEC_BASEAPLICACAO` table. All the data in the column will be lost.
  - You are about to drop the column `TEC_BaseAplicacaoUpdatedAt` on the `TEC_BASEAPLICACAO` table. All the data in the column will be lost.
  - You are about to drop the column `TEC_CanalCreatedAt` on the `TEC_CANAL` table. All the data in the column will be lost.
  - You are about to drop the column `TEC_CanalUpdatedAt` on the `TEC_CANAL` table. All the data in the column will be lost.
  - You are about to drop the column `TEC_EndpointCreatedAt` on the `TEC_ENDPOINT` table. All the data in the column will be lost.
  - You are about to drop the column `TEC_EndpointUpdatedAt` on the `TEC_ENDPOINT` table. All the data in the column will be lost.
  - You are about to drop the column `TEC_ParametroCreatedAt` on the `TEC_PARAMETRO` table. All the data in the column will be lost.
  - You are about to drop the column `TEC_ParametroUpdatedAt` on the `TEC_PARAMETRO` table. All the data in the column will be lost.
  - You are about to drop the column `TEC_ParametroBaseAplicacaoCreatedAt` on the `TEC_PARAMETROBASEPLICACAO` table. All the data in the column will be lost.
  - You are about to drop the column `TEC_ParametroBaseAplicacaoUpdatedAt` on the `TEC_PARAMETROBASEPLICACAO` table. All the data in the column will be lost.
  - You are about to drop the column `USU_UsuarioCreatedAt` on the `USU_USUARIO` table. All the data in the column will be lost.
  - You are about to drop the column `USU_UsuarioUpdatedAt` on the `USU_USUARIO` table. All the data in the column will be lost.
  - You are about to drop the column `USU_UsuarioCanalCreatedAt` on the `USU_USUARIOCANAL` table. All the data in the column will be lost.
  - You are about to drop the column `USU_UsuarioCanalUpdatedAt` on the `USU_USUARIOCANAL` table. All the data in the column will be lost.
  - You are about to drop the column `USU_UsuarioEndpointCreatedAt` on the `USU_USUARIOENDPOINT` table. All the data in the column will be lost.
  - You are about to drop the column `USU_UsuarioEndpointUpdatedAt` on the `USU_USUARIOENDPOINT` table. All the data in the column will be lost.
  - Added the required column `UpdatedAt` to the `TEC_BASEAPLICACAO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `TEC_CANAL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `TEC_ENDPOINT` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `TEC_PARAMETRO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `TEC_PARAMETROBASEPLICACAO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `USU_USUARIO` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `USU_USUARIOCANAL` table without a default value. This is not possible if the table is not empty.
  - Added the required column `UpdatedAt` to the `USU_USUARIOENDPOINT` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TEC_BASEAPLICACAO" DROP COLUMN "TEC_BaseAplicacaoCreatedAt",
DROP COLUMN "TEC_BaseAplicacaoUpdatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Eliminar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TEC_CANAL" DROP COLUMN "TEC_CanalCreatedAt",
DROP COLUMN "TEC_CanalUpdatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Eliminar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TEC_ENDPOINT" DROP COLUMN "TEC_EndpointCreatedAt",
DROP COLUMN "TEC_EndpointUpdatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Eliminar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TEC_PARAMETRO" DROP COLUMN "TEC_ParametroCreatedAt",
DROP COLUMN "TEC_ParametroUpdatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Eliminar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TEC_PARAMETROBASEPLICACAO" DROP COLUMN "TEC_ParametroBaseAplicacaoCreatedAt",
DROP COLUMN "TEC_ParametroBaseAplicacaoUpdatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Eliminar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "USU_USUARIO" DROP COLUMN "USU_UsuarioCreatedAt",
DROP COLUMN "USU_UsuarioUpdatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Eliminar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "USU_USUARIOCANAL" DROP COLUMN "USU_UsuarioCanalCreatedAt",
DROP COLUMN "USU_UsuarioCanalUpdatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Eliminar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "USU_USUARIOENDPOINT" DROP COLUMN "USU_UsuarioEndpointCreatedAt",
DROP COLUMN "USU_UsuarioEndpointUpdatedAt",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Eliminar" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "UpdatedAt" TIMESTAMP(3) NOT NULL;
