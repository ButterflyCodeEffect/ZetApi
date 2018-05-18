import { Controller } from "./Controller";
import { Application, Request, Response } from "express";
import { UserService } from "../services/UserService";
import UserValidator from "../helpers/UserValidator";
import { User } from "../entity/User";
import { Errors } from "../helpers/errorCodes";

export class UserController implements Controller {
    private userService: UserService;
    private userValidator: UserValidator;

    public constructor() {
        this.userService = new UserService();
        this.userValidator = new UserValidator();
    }

    public initialize(application: Application): void {
        application.get("/users", this.listUsers.bind(this));
        application.get("/user/:id", this.getUser.bind(this));
        application.post("/user", this.userValidator.isCreateValid.bind(this.userValidator), this.createUser.bind(this));
        application.put("/user/:id", this.userValidator.isUpdateValid.bind(this.userValidator), this.updateUser.bind(this));
        application.delete("/user/:id", this.deleteUser.bind(this));
    }

    private listUsers(request: Request, response: Response): void {
        this.userService.listUsers().then(result => {
            response.json(result);
        });
    }

    private async getUser(request: Request, response: Response): Promise<void> {
        let user: User = await this.userService.getUser({id: request.params.id, deletedDate: null})
        user ? response.json(user) : response.json(Errors.USER_NOT_EXISTS);
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