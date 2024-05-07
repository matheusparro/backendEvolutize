"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const web_push_1 = __importDefault(require("web-push"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// WebPush
const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM';
const privateKey = 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU';
web_push_1.default.setVapidDetails('https://backendevolutize.onrender.com', publicKey, privateKey);
//webPush.setVapidDetails('https://localhost:3333', publicKey, privateKey);
app.get('/notification/push/public_key', (request, response) => {
    return response.json({ publicKey });
});
app.get('/', (request, response) => {
    return response.send("TESTETESTETETETET");
});
app.post('/notification/push/register', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscription } = request.body;
        yield prisma.user.create({
            data: {
                endpoint: subscription.endpoint,
                p256dh: subscription.keys.p256dh,
                auth: subscription.keys.auth,
                name: "teste",
            }
        });
        return response.sendStatus(201);
    }
    catch (error) {
        console.error("Erro ao registrar usuário:", error);
        return response.status(500).json({ error: "Erro ao registrar usuário." });
    }
}));
// Rota para enviar uma notificação push
app.post('/notification/push/send', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = request.body;
        const users = yield prisma.user.findMany();
        for (const user of users) {
            let subscription = {
                endpoint: user.endpoint,
                keys: {
                    auth: user.auth,
                    p256dh: user.p256dh
                }
            };
            try {
                const notificationSend = web_push_1.default.sendNotification(subscription, JSON.stringify({
                    icon: message.icon,
                    title: message.title,
                    body: message.body,
                    imageUrl: message.imageUrl
                }));
            }
            catch (error) {
                console.error("Erro ao enviar notificação push para o usuário:", user.id, error);
            }
        }
        return response.sendStatus(201);
    }
    catch (error) {
        console.error("Erro ao enviar notificação push:", error);
        return response.status(500).json({ error: "Erro ao enviar notificação push." });
    }
}));
app.listen(3333, () => console.log('SERVER IS RUNNING AT :3333'));
