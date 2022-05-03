import express, {Express} from "express";
import { debug } from "console";
import http from "http";
import expressApp from "./expressApp";

// import { Post, PostsGetRequestResponseObject } from "../models/post.model";


export default class Server {
    private port: number|string;
    private expressApp: Express;
    private httpServer: http.Server;

    constructor(port:number) {
        this.port = (process.env.PORT || port);
        this.expressApp = expressApp;

        this.expressApp.set("port", this.port);
        this.httpServer = http.createServer(this.expressApp);
    }

    public start() {
        this.httpServer.on("error", (err:NodeJS.ErrnoException)=>this.onError(err));
        this.httpServer.on("listening", ()=>this.onListening());

        this.httpServer.listen(this.port);
    }

    public getHttpServer() {
        return this.httpServer;
    }


    private onError(error:NodeJS.ErrnoException) {
    
        if (error.syscall !=="listen") {
            throw error;
        }
        const bind = typeof this.port === "string" ? "pipe " + this.port : "port " + this.port;
        switch (error.code) {
            case "EACCES":
            console.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
            case "EADDRINUSE":
            console.error(bind + " is already in use");
            process.exit(1);
            break;
            default:
            throw error;
        }
    }

    private onListening() {
        // const addr = this.httpServer.address();
        const bind = typeof this.port === "string" ? "pipe " + this.port : "port " + this.port;
        debug("Listening on " + bind);
    }


}
