import * as express from 'express';

export default class Routes {
    private router: express.Router;
    
    public constructor (router: express.Router) {
        this.router = router;
    }

    public register (): void {
        this.router.get('/test', (req: express.Request, res: express.Response) => {
            res.json({message:"server started"});
        });

        this.router.get('/test2', (req: express.Request, res: express.Response) => {
            res.json({message:"server started2"});
        });
    }
}