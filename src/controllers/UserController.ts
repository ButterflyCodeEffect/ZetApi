import { Application, Request, Response } from "express";

import { Server } from "../Server";
import { Controller } from "./Controller";
import { UserService } from "../Services/UserService";
import { UserValidator } from "../Validators/UserValidator";



export class UserController implements Controller {
    private readonly application: Application;
    private readonly userService: UserService;
    private readonly userValidator: UserValidator;

    public constructor(server: Server) {
        this.application  = server.getApplication();
        this.userService = new UserService(server.getJwtManager());
        this.userValidator = new UserValidator(this.userService);      
    }

    public register(): void {
        this.application.get("/users", this.listUsers.bind(this));
        this.application.get("/user/:id", this.listUser.bind(this));
        this.application.post("/user", this.userValidator.validateCreate.bind(this.userValidator), this.createUser.bind(this));
        this.application.put("/user/:id", this.userValidator.validateCreate.bind(this.userValidator), this.updateUser.bind(this));
        this.application.delete("/user/:id", this.deleteUser.bind(this));
        this.application.post("/user/login", this.loginUser.bind(this));
    }

    private async listUsers(request: Request, response: Response): Promise<void> {
        response.json(await this.userService.listUsers());
    }

    private async listUser(request: Request, response: Response): Promise<void> {
        response.json(await this.userService.listUser({ id: request.params.id, deletedDate: null }));
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

    private async loginUser(request: Request, response: Response): Promise<void> {
        response.json(await this.userService.loginUser({ email: request.body.email, password: request.body.password }));
    }
}