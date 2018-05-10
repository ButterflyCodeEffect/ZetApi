import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import MiddlewareHandler from "./helpers/middlewareHandler";

class Server {
    private port: number;
    private app: express.Application;
    private appRoutes: Routes;

    public constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT) || 8080;
        this.appRoutes = new Routes(this.app);
    }

    public createServer(): void {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        this.registerRoutes();
        this.app.listen(this.port);
    }

    private registerRoutes () {
        this.appRoutes.register();
    }
}

createConnection().then(()=>{
    const server: Server = new Server();
    server.createServer();
}).catch(console.log);


