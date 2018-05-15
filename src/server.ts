import "reflect-metadata";
import { createConnection } from "typeorm";
import {Request, Response} from "express";
import * as bodyParser from "body-parser";
import * as express from "express";

import { CONTROLLERS } from "./controller/Bootstrap";


class Server {
    private port: number;
    private app: express.Application;

    public constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT) || 8080;
    }

    public createServer(): void {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        CONTROLLERS.forEach(controller => {
            controller.initialize(this.app);
        });
        this.app.listen(this.port);
    }
}

createConnection().then(()=>{
    const server: Server = new Server();
    server.createServer();
}).catch(console.log);


