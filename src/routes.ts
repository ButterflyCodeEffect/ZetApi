import * as express from 'express';

export default class Routes {
    
    constructor (private router: express.Router) {
        this.routes();
    }

    routes () {
        this.router.get('/test', (req: express.Request, res: express.Response) => {
            res.json({message:"server started"});
        });

        this.router.get('/test2', (req: express.Request, res: express.Response) => {
            res.json({message:"server started2"});
        });
    }
}