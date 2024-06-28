import express, { NextFunction, Request, Response } from 'express';
import PSH_RegisterNotificationController from '../controllers/PSH_RegisterNotificationController';

const router = express.Router();
const psh_registerNotificationController = new PSH_RegisterNotificationController();

router.post('/notification/push/register', async (request: Request, response: Response, next: NextFunction) => {
  try {
    await psh_registerNotificationController.registerNotification(request, response, next);

  } catch (error:any) {
    
  }
});

export default router;