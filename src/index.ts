import Server from "./server/server";
import SocketServer from "./socket/socket-server";

const PORT = process.env.PORT || 4000;

export class App {
  private server: Server | null = null;
  private socketServer: SocketServer | null = null;

  public initServer(port: number | string) {
    console.info(`App::initServer( ${port} ) - start`);
    this.server = new Server(port);
    this.server.start();
    this.socketServer = new SocketServer(this.server.getHttpServer());
  }
}

const app = new App();
app.initServer(PORT);
