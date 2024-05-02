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
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://frontevolutize.onrender.com');
//   // Você também pode especificar várias origens ou '*' para permitir qualquer origem
//   // res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   // Defina como true se precisar incluir cookies na solicitação
//   // res.setHeader('Access-Control-Allow-Credentials', true);
//   next();
// });
// WebPush
const publicKey = 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM';
const privateKey = 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU';
//WebPush.setVapidDetails('https://backendevolutize.onrender.com', 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM', 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU');
//WebPush.setVapidDetails('http://localhost:3333', 'BBsXYqVS8EFi29zDPFD_uFUg11oaKBowNRqk-O-WqP3cmzzQOuSyCTUGUsStGtZFKEz8f2XYEx-mDawfhCg4hAM', 'akUfQDG1egwhDbLFzg__48BYOSuV9kti4upgRKGX8KU');
web_push_1.default.setVapidDetails('https://localhost:3333', publicKey, privateKey);
app.get('/notification/push/public_key', (request, response) => {
    return response.json({ publicKey });
});
app.get('/', (request, response) => {
    return response.send("TESTE");
});
app.post('/notification/push/register', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const { subscription } = request.body;
    yield prisma.user.create({
        data: {
            name: "Matheus",
            auth: subscription.keys.auth,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
        }
    });
    return response.sendStatus(201);
}));
// app.post('/notification/push/send', async (request, response) => {
//   const user = await prisma.user.findFirst(); // Consulta o primeiro usuário
// const { subscription } = {
//   subscription:{
//     endpoint:user?.endpoint,
//     keys:{
//       p256dh:user?.p256dh,
//       auth:user?.auth
//     }
//   }
// }as ISubscription;
//     console.log("AQUI A SUBSCRICACAO"+JSON.stringify(subscription))
//     WebPush.sendNotification(
//       subscription,
//       JSON.stringify({
//         icon: 'your-icon-link.png',
//         title: 'NOTIFICAÇÃO EVOLUTIZE',
//         body: 'Content of your message',
//         imageUrl: 'your-image-link.png'
//       }),
//     );
//   return response.sendStatus(201);
// });
app.post('/notification/push/send', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.user.findUnique({
            where: {
                id: 2
            }
        }); // Consulta o primeiro usuário
        // Verifica se um usuário foi encontrado
        if (!user) {
            throw new Error('Nenhum usuário encontrado.');
        }
        // Constrói o objeto de subscription
        // const subscription = {
        //   endpoint: user.endpoint,
        //   keys: {
        //     p256dh: user.p256dh,
        //     auth: user.auth
        //   }
        // };
        const subscription = {
            "endpoint": "https://web.push.apple.com/QIOV6iGU2FKwyHQae0CT-2VCnVvdLJWBLInx8IVPMxbgVfI5DSKLmvb5gHxF9y4_e-E5wfoKo_5d8Vtlcn26cpZ-lbRqQku6kJec-rcXYDpoiVc8odVncpenz9JKeCHskXhhH_e15HqjJxon8Q6quvM9c4zETVRDyg_SZppoGg8",
            "keys": {
                "p256dh": "BJfRvVeQu6JDO-WrbXavJgm-xyPsaWLqJNBZaUjcdKHDe_8fs8TCqdpMPs-LQNSN05r2AG3zSYAOyDWJuckzz6s",
                "auth": "OgxebpQEu3j0eraIvYldXw"
            }
        };
        // Extrai os parâmetros do req.body
        const { icon, title, body, imageUrl } = request.body;
        // Verifica se os parâmetros necessários estão presentes
        if (!icon || !title || !body || !imageUrl) {
            throw new Error('Parâmetros incompletos.');
        }
        console.log("AQUI A SUBSCRICACAO", subscription);
        // Envia a notificação push com os dados do req.body
        yield web_push_1.default.sendNotification(subscription, JSON.stringify({
            icon,
            title,
            body,
            imageUrl
        }));
        return response.sendStatus(201);
    }
    catch (error) {
        console.error('Erro ao enviar notificação:', error.message);
        return response.status(500).send('Erro ao enviar notificação.');
    }
}));
app.listen(3333, () => console.log('SERVER IS RUNNING AT :3333'));
