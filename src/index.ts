import * as express from 'express';
import * as bodyParser from 'body-parser';

import Routes from './routes';

class Server {
    private port: number;
    private router: express.Router;
    private app: express.Application;
    private routes: Routes;

    public constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT) || 8080;
        this.router = express.Router();
        this.routes = new Routes(this.router);
    }

    public createServer(): void {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        this.app.use('/api', this.router);
        this.routes.register();
        this.app.listen(this.port);
    }
}

const server: Server = new Server();
server.createServer();