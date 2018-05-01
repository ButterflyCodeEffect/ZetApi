import * as express from 'express';
import * as bodyParser from 'body-parser';
import Routes from './routes';

class Server {

    private port: number;
    private router: express.Router;
    private app: express.Application;

    constructor() {
        this.app = express();
        this.port = parseInt(process.env.PORT) || 8080;
        this.router = express.Router();
        this.createServer();
    }

    createServer () {
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());

        this.app.use('/api', this.router);

        new Routes(this.router);

        this.app.listen(this.port);
    }
}

new Server();