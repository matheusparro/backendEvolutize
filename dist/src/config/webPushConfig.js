"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_push_1 = __importDefault(require("web-push"));
web_push_1.default.setVapidDetails('https://localhost:3333', String(process.env.PUBLIC_VAPID_KEY), String(process.env.PRIVATE_VAPID_KEY));
exports.default = web_push_1.default;
