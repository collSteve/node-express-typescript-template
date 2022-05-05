import { Namespace, Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import http from "http";
import { GameService, IGameService } from "../services/game-service";

export default class SocketServer {
	private io: Server<DefaultEventsMap,DefaultEventsMap,DefaultEventsMap,any>;
	private httpServer: http.Server;
	private gameIo: Namespace<DefaultEventsMap,DefaultEventsMap,DefaultEventsMap,any>;
	private sessionIo: Namespace<DefaultEventsMap,DefaultEventsMap,DefaultEventsMap,any>;

	private gameService:GameService;

	constructor(httpServer:http.Server) {
		this.io = new Server({});
		this.gameService = GameService.getInstance();

		this.gameIo = this.io.of("/game");
		this.sessionIo = this.io.of("/sessions");

		this.httpServer = httpServer;
		this.io.listen(httpServer);
	}

	private initializeSocketConnections() {
		this.gameIo.on("connection", (socket)=>{
			socket.emit("new user joins");

			socket.on("move play", (moveInfo)=>{
				socket.id;
			});
		});

		this.io.on("connection", (socket) => {
			
		});

		
	}


}


