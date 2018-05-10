import { Router, Request, Response, Application } from "express";

import { UserController } from "./controller/UserController";
import MiddlewareHandler from "./helpers/middlewareHandler";

export class Routes {
    private userController: UserController;
    private middlewareHandler: MiddlewareHandler;
    private app: Router;

    public constructor(app: Application) {
        this.userController = new UserController();
        this.middlewareHandler = new MiddlewareHandler();
        this.app = app;
    }

    public register(): void {
        this.app.get('/users', this.userController.getAll);
        //this.router.put('/users/update', this.userValidator.isUpdateValid, this.userController.updateUser);
        //this.router.delete('/users/delete', this.userValidator.isDeleteValid, this.userController.deleteUser);
    }
}