import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma'; // Importando a instância do PrismaClient

const router = Router();

// Rota para criar um novo TEC_PARAMETRO
router.post('/tec_parametro', async (req: Request, res: Response) => {
  try {
    const { TEC_ParametroCodigoCliente, TEC_ParametroNomeCliente } = req.body;
    const novoParametro = await prisma.tEC_PARAMETRO.create({
      data: {
        TEC_ParametroCodigoCliente,
        TEC_ParametroNomeCliente,
      },
    });
    res.json(novoParametro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar o TEC_PARAMETRO.' });
  }
});

// Rota para buscar todos os TEC_PARAMETROs
router.get('/tec_parametro', async (req: Request, res: Response) => {
  try {
    const parametros = await prisma.tEC_PARAMETRO.findMany({
        include:{
            TEC_CANAL: true
        }
    });
    res.json(parametros);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os TEC_PARAMETROs.' });
  }
});

// Rota para buscar um TEC_PARAMETRO por ID
router.get('/tec_parametro/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const parametro = await prisma.tEC_PARAMETRO.findUnique({
      where: {
        TEC_ParametroCodigoCliente: parseInt(id),
      },
    });
    res.json(parametro);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar o TEC_PARAMETRO.' });
  }
});

// Rota para atualizar um TEC_PARAMETRO por ID
router.put('/tec_parametro/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { TEC_ParametroNomeCliente } = req.body;
  try {
    const parametroAtualizado = await prisma.tEC_PARAMETRO.update({
      where: {
        TEC_ParametroCodigoCliente: parseInt(id),
      },
      data: {
        TEC_ParametroNomeCliente,
      },
    });
    res.json(parametroAtualizado);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar o TEC_PARAMETRO.' });
  }
});

// Rota para deletar um TEC_PARAMETRO por ID
router.delete('/tec_parametro/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.tEC_PARAMETRO.delete({
      where: {
        TEC_ParametroCodigoCliente: parseInt(id),
      },
    });
    res.json({ message: 'TEC_PARAMETRO deletado com sucesso.' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar o TEC_PARAMETRO.' });
  }
});

export default router;
