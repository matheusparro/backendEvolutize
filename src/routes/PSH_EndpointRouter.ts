import express from 'express';
import PSH_EndpointController from '../controllers/PSH_EndpointController';
import AppError from '../errorException/AppError';

const router = express.Router();
const psh_endpointController = new PSH_EndpointController();
router.post('/notification/endpoint/lastlogin', async (req, res, next) => {
  try {
    await psh_endpointController.updateLastLogin(req, res, next);
  } catch (error: any) {
    console.error("Erro na rota ao atualizar último login:", error);
    return next(error);
  }
});
  

export default router;
