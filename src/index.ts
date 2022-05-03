import Server from "./server/server";
import SocketServer from "./socket/socket-server";

export class App {
    private server:Server|null = null;
    private socketServer:SocketServer|null = null;

    public initServer(port: number) {
        this.server = new Server(port);
        this.server.start();
        this.socketServer = new SocketServer(this.server.getHttpServer());
    }
}

const app = new App();
app.initServer(4000);


