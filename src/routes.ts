
import {Request, Response, Router} from "express";
import UserController from './controllers/UserController'

export default class Routes {
    private router: Router;
    private userController: UserController;
    
    public constructor (router: Router) {
        this.router = router;
        this.userController = new UserController();    
        
    }

    public register (): void {
        
        this.router.get('/users', (req: Request, res: Response) => {
            this.userController.getAllUsers().then((result)=>{
                res.json(result)
            }).catch((err)=>{
                res.json({error: err})
            })
        });

        this.router.get('/test2', (req: Request, res: Response) => {
            this.userController.createUser().then(r => {
                res.json("success")
            })
        });
    }
}