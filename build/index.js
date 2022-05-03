"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const server_1 = __importDefault(require("./server/server"));
class App {
    initServer(port) {
        const server = new server_1.default(port);
        server.start();
    }
}
exports.App = App;
const app = new App();
app.initServer(4000);
