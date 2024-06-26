import express, { Request, Response } from 'express';
import PSH_RegisterNotificationController from '../controllers/PSH_RegisterNotificationController';

const router = express.Router();
const psh_registerNotificationController = new PSH_RegisterNotificationController();

router.post('/notification/push/register', async (request: Request, response: Response) => {
  try {
    console.log("FOIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII")
    await psh_registerNotificationController.registerNotification(request, response);

  } catch (error:any) {
    console.error("Erro ao registrar usuário:", error.message);
    return response.status(500).json({ error: "Erro ao registrar usuário." });
  }
});

export default router;