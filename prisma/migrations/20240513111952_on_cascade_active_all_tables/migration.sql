-- DropForeignKey
ALTER TABLE "TEC_CANAL" DROP CONSTRAINT "TEC_CANAL_TEC_BaseAplicacaoId_fkey";

-- DropForeignKey
ALTER TABLE "TEC_CANAL" DROP CONSTRAINT "TEC_CANAL_TEC_ParametroCodigoCliente_fkey";

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

-- AddForeignKey
ALTER TABLE "TEC_CANAL" ADD CONSTRAINT "TEC_CANAL_TEC_ParametroCodigoCliente_fkey" FOREIGN KEY ("TEC_ParametroCodigoCliente") REFERENCES "TEC_PARAMETRO"("TEC_ParametroCodigoCliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TEC_CANAL" ADD CONSTRAINT "TEC_CANAL_TEC_BaseAplicacaoId_fkey" FOREIGN KEY ("TEC_BaseAplicacaoId") REFERENCES "TEC_BASEAPLICACAO"("TEC_BaseAplicacaoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIO" ADD CONSTRAINT "USU_USUARIO_TEC_ParametroCodigoCliente_fkey" FOREIGN KEY ("TEC_ParametroCodigoCliente") REFERENCES "TEC_PARAMETRO"("TEC_ParametroCodigoCliente") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIO" ADD CONSTRAINT "USU_USUARIO_TEC_BaseAplicacaoId_fkey" FOREIGN KEY ("TEC_BaseAplicacaoId") REFERENCES "TEC_BASEAPLICACAO"("TEC_BaseAplicacaoId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIOCANAL" ADD CONSTRAINT "USU_USUARIOCANAL_USU_UsuarioId_fkey" FOREIGN KEY ("USU_UsuarioId") REFERENCES "USU_USUARIO"("USU_UsuarioId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIOCANAL" ADD CONSTRAINT "USU_USUARIOCANAL_TEC_CanalId_fkey" FOREIGN KEY ("TEC_CanalId") REFERENCES "TEC_CANAL"("TEC_CanalId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIOENDPOINT" ADD CONSTRAINT "USU_USUARIOENDPOINT_USU_UsuarioId_fkey" FOREIGN KEY ("USU_UsuarioId") REFERENCES "USU_USUARIO"("USU_UsuarioId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "USU_USUARIOENDPOINT" ADD CONSTRAINT "USU_USUARIOENDPOINT_TEC_EndpointId_fkey" FOREIGN KEY ("TEC_EndpointId") REFERENCES "TEC_ENDPOINT"("TEC_EndpointId") ON DELETE CASCADE ON UPDATE CASCADE;