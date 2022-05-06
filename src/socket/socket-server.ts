import { Namespace, Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import http from "http";
import { GameService, IGameService } from "../services/game-service";
import UserService from "../services/user-service";
import { GameType } from "../models/game_users_info_model";
import { GameState } from "../models/game";

type GameSocketType = Socket<DefaultEventsMap,DefaultEventsMap,DefaultEventsMap,any>;
type SessionSocketType = Socket<DefaultEventsMap,DefaultEventsMap,DefaultEventsMap,any>;

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
		this.gameService.createGameForUser("123", GameType.TicTacToe, true, 2)
		.then((status)=>{
			const gameId = status.gameStatus.gameId;
			console.log(`GameID: ${gameId}: ${this.gameService.getAllUserIdsInGame(gameId)}`);

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

		this.initializeSocketConnections();

		this.httpServer = httpServer;
		this.io.listen(httpServer);
	}

	private initializeSocketConnections() {
		this.io.on("connection", (socket)=>{
			this.onUserConnetion(socket);

		});

		this.gameIo.on("connection", (socket)=>{

			socket.on("user request create game", (createGameRequestInfo:any)=>{
				this.onUserRequestCreateGame(socket, createGameRequestInfo);
			});

			socket.on("user request join game", (joinGameRequestInfo:any)=>{
				this.onUserRequestJoinGame(socket, joinGameRequestInfo);
			});

			socket.on("user played move", (gameMoveRequestInfo:any)=>{
				this.onUserRequestGameMove(socket, gameMoveRequestInfo);
			});

			socket.on("user request quit game", (quitGameRequestInfo:any)=>{
				this.onUserRequestQuitGame(socket, quitGameRequestInfo);
			});
		});
		
	}

	onUserConnetion(socket:SessionSocketType) {

	}

	onUserRequestJoinGame(socket:SessionSocketType, joinGameRequestInfo:any) {

	}

	onUserRequestCreateGame(socket:SessionSocketType, createGameRequestInfo:any) {
		console.log(`Recieved client's request to create game: <${createGameRequestInfo}>`);
	}

	onUserRequestGameMove(socket:SessionSocketType, gameMoveRequestInfo:any) {

	}

	onUserRequestQuitGame(socket:SessionSocketType, quitGameRequestInfo:any) {

	}

}


