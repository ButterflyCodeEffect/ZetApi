import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {Request, Response} from "express";
import {Routes} from "./routes";
import MiddlewareHandler from "./helpers/middlewareHandler";

class Server {
    private port: number;
    private router: express.Router;
    private app: express.Application;
    private appRoutes: Array<any>;

    public constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT) || 8080;
        this.router = express.Router();
        this.appRoutes = Routes
    }

    public createServer(): void {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        this.registerRoutes();
        this.app.listen(this.port);
    }

    // dont touch this, only god and satan knows what's happening here
    // all you need to know mortal, is that the routes work here
    private registerRoutes () {
        const middleware = new MiddlewareHandler();
        this.appRoutes.forEach(route => {
            (this.app as any)[route.method](route.route, middleware[route.middleware].bind(middleware), (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
    
                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }
            });
        });
    }
}

createConnection().then(()=>{
    const server: Server = new Server();
    server.createServer();
}).catch(console.log);


