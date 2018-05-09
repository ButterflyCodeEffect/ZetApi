import { Router, Request, Response } from "express";

import { UserController } from "./controller/UserController";
import MiddlewareHandler from "./helpers/middlewareHandler";

export class Routes {
    private userController: UserController;
    private middlewareHandler: MiddlewareHandler;
    private router: Router;

    public constructor(router: Router) {
        this.userController = new UserController();
        this.middlewareHandler = new MiddlewareHandler();
        this.router = router;
    }

    public register(): void {
        this.router.post('/users/create', this.middlewareHandler.validateUser, this.userController.createUser);
        //this.router.put('/users/update', this.userValidator.isUpdateValid, this.userController.updateUser);
        //this.router.delete('/users/delete', this.userValidator.isDeleteValid, this.userController.deleteUser);
    }
}