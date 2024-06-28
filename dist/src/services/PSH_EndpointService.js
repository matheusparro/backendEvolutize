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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class PSH_EndpointService {
    getEndpointByEndpoint(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prismaClient = new client_1.PrismaClient();
                const endpointFound = yield prismaClient.pSH_Endpoint.findFirst({
                    where: {
                        PSH_EndpointEndpoint: endpoint,
                    }
                });
                return endpointFound;
            }
            catch (error) {
                console.error('Erro ao criar endpoint:', error.message);
                // Trate o erro de acordo com a necessidade da sua aplicação,
                // como logá-lo, notificar o usuário, etc.
                throw new Error('Falha ao criar endpoint.');
            }
        });
    }
    updateEndpointLastLogin(endpointId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const prismaClient = new client_1.PrismaClient();
                yield prismaClient.pSH_Endpoint.update({
                    where: {
                        PSH_EndpointId: endpointId,
                    },
                    data: {
                        PSH_EndpointUltimoLogin: new Date(),
                    }
                });
            }
            catch (error) {
                console.error('Erro ao atualizar último login:', error.message);
                // Trate o erro de acordo com a necessidade da sua aplicação,
                // como logá-lo, notificar o usuário, etc.
                throw new Error('Falha ao atualizar último login.');
            }
        });
    }
}
exports.default = PSH_EndpointService;
