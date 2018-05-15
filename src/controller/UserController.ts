import { Controller } from "./Controller";
import { Application, Request, Response } from "express";
import { UserService } from "../services/UserService";
import UserValidator from "../helpers/UserValidator";
import { User } from "../entity/User";

export class UserController implements Controller {
    private userService: UserService;
    private userValidator: UserValidator;

    public constructor() {
        this.userService = new UserService();
        this.userValidator = new UserValidator();
    }

    public initialize(application: Application): void {
        application.get("/users", this.listUsers);
        application.get("/user/:id", this.getUser);
        application.post("/user", this.userValidator.isCreateValid, this.createUser);
        application.put("/user/:id", this.userValidator.isUpdateValid, this.updateUser);
        application.delete("/user/:id", this.deleteUser);
    }

    private listUsers(request: Request, response: Response): void {
        console.log("UserController::listUsers");
        console.log(this.userService);
        this.userService.listUsers().then(result => {
            response.json(result);
        });
    }

    private async getUser(request: Request, response: Response): Promise<void> {
        response.json(await this.userService.getUser({id: request.params.id}));
    }

    private async createUser(request: Request, response: Response): Promise<void> {
        response.json(await this.userService.createUser(request.body));
    }

    private async updateUser(request: Request, response: Response): Promise<void> {
        response.json(await this.userService.updateUser(request.body));
    }

    private async deleteUser(request: Request, response: Response): Promise<void> {
        response.json(await this.userService.deleteUser(request.params.id));
    }
}