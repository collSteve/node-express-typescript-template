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

		
		
		
		this.gameIo = this.io.of("/game");
		this.sessionIo = this.io.of("/sessions");

		this.initializeSocketConnections();

		this.httpServer = httpServer;
		this.io.listen(httpServer);

		// testing
		this.testJoinCreateGame();
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

	/*
		Dummy Test for testing join and create game
	*/
	private async testJoinCreateGame(time:number = 5000) {
		// testing

		const id1 = this.userService.createPermanentUser("pa", "123@abc.com", "123");
		const id2 = this.userService.createPermanentUser("pb", "1233@abc.com", "abc");
		const id3 = this.userService.createPermanentUser("pc", "12343@abc.com", "ijk");
		const id4 = this.userService.createPermanentUser("pd", "124334r3@abc.com", "ijk");
		const id5 = this.userService.createPermanentUser("pe", "12frf3@abc.com", "ijk");

		this.gameService.joinUserToGame(id1, GameType.TicTacToe).then(()=>{
				this.gameService.joinUserToGame(id2, GameType.TicTacToe);
				this.gameService.joinUserToGame(id3, GameType.TicTacToe);
				this.gameService.joinUserToGame(id4, GameType.TicTacToe);
				this.gameService.joinUserToGame(id5, GameType.TicTacToe);
			}
		);
		

		setInterval(()=>{
			console.log("==== Test join create game ====");

			for (const [gameId, game] of this.gameService.getAllGames().entries()) {
				console.log(`${gameId}= players: [${game.getPlayerUserIds()}], Game ready: ${game.getGameState()==GameState.WaitToStart}`);
			}
		}, time);
        
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


