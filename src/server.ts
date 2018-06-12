import 'reflect-metadata';
import { Request, Response } from "express";
import { createConnection } from "typeorm";
import * as bodyParser from "body-parser";
import * as socketIo from "socket.io"
import * as express from "express";
import * as http from "http";

import { Errors } from "./Helpers/Errors";
import { CONTROLLERS } from "./Controllers/Index";
import { JwtManager } from "./helpers/JwtManager";
import { Controller } from "./controllers/Controller";

export class Server {
    private port: number;
    private jwtManager: JwtManager;
    private httpServer: http.Server;
    private socketServer: socketIo.Server;
    private application: express.Application;

    public getJwtManager(): JwtManager {
        return this.jwtManager;
    }

    public getHttpServer(): http.Server {
        return this.httpServer;
    }

    public getSocketServer(): socketIo.Server {
        return this.socketServer;
    }

    public getApplication(): express.Application {
        return this.application;
    }

    public constructor() {
        this.application = express();
        this.httpServer = http.createServer(this.application);
        this.port = parseInt(process.env.PORT) || 8080;
        this.socketServer = socketIo(this.httpServer);
    }

    public createServer(): void {
        this.application.use(bodyParser.urlencoded({ extended: true }));
        this.application.use(bodyParser.json());
        CONTROLLERS.forEach(controller => {
            let item: Controller = new controller(this);
            item.register();
        });
        this.application.use((error: any, request: Request, response: Response, next: Function) =>
        {
            console.log(error);
            response.json(Errors.SERVER_ERROR)
        });
        this.application.listen(this.port);
    }
}

createConnection().then(() => {
    const server: Server = new Server();
    server.createServer();
}).catch(console.log);


