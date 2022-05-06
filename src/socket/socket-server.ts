import { Namespace, Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import http from "http";
import { GameService, IGameService } from "../services/game-service";
import UserService from "../services/user-service";
import { GameType } from "../models/game_users_info_model";
import { GameState } from "../models/game";

export default class SocketServer {
	private io: Server<DefaultEventsMap,DefaultEventsMap,DefaultEventsMap,any>;
	private httpServer: http.Server;
	private gameIo: Namespace<DefaultEventsMap,DefaultEventsMap,DefaultEventsMap,any>;
	private sessionIo: Namespace<DefaultEventsMap,DefaultEventsMap,DefaultEventsMap,any>;

	private gameService:GameService;
	private userService:UserService;

	constructor(httpServer:http.Server) {
		this.io = new Server({});
		this.gameService = GameService.getInstance();
		this.userService = UserService.getInstance();

		// testing
		this.userService.createNewUser("123", "123");
		this.gameService.createGameForUser("123", GameType.TicTacToe, true)
		.then((status)=>{
			const gameId = status.gameStatus.gameId;
			console.log(`GameID: ${gameId}: ${this.gameService.getAllUserIdsInGame(gameId)}`);
			console.log("GameState: ", this.gameService.getGameById(gameId).getGameState()==GameState.WaitForPlayersToJoin);

			// new player
			this.userService.createNewUser("abc", "abc");
			this.gameService.joinUserToGame("abc", GameType.TicTacToe)
			.then((status)=>{
				const gameId = status.gameStatus.gameId;
				console.log(`GameID: ${gameId}: ${this.gameService.getAllUserIdsInGame(gameId)}`);
			
				// new player
				this.userService.createNewUser("ijk", "ijk");
				this.gameService.joinUserToGame("ijk", GameType.TicTacToe)
				.then((status)=>{
					const gameId = status.gameStatus.gameId;
					console.log(`GameID: ${gameId}: ${this.gameService.getAllUserIdsInGame(gameId)}`);
				});
			});
		});
		
		
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


