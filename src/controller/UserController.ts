import { Controller } from "./Controller";
import { Application, Request, Response } from "express";
import { hash, compare } from 'bcrypt';
import { UserService } from "../services/UserService";
import UserValidator from "../helpers/UserValidator";
import { User } from "../entity/User";
import { Errors } from "../helpers/errorCodes";
import { JwtManager } from "../helpers/JwtManager";

export class UserController implements Controller {
    private userService: UserService;
    private userValidator: UserValidator;
    private jwtManager: JwtManager;

    public constructor() {
        this.userService = new UserService();
        this.userValidator = new UserValidator();
        this.jwtManager = new JwtManager();
    }

    public initialize(application: Application): void {
        application.get("/users", this.listUsers.bind(this));
        application.get("/user/:id", this.getUser.bind(this));
        application.post("/user", this.userValidator.isCreateValid.bind(this.userValidator), this.createUser.bind(this));
        application.put("/user/:id", this.userValidator.isUpdateValid.bind(this.userValidator), this.updateUser.bind(this));
        application.delete("/user/:id", this.deleteUser.bind(this));
        application.post("/user/login", this.login.bind(this));
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
        let user = request.body;
        user.password = await hash(user.password , 10);
        response.json(await this.userService.createUser(request.body));
    }

    private async updateUser(request: Request, response: Response): Promise<void> {
        response.json(await this.userService.updateUser(request.body));
    }

    private async deleteUser(request: Request, response: Response): Promise<void> {
        response.json(await this.userService.deleteUser(request.params.id));
    }

    private async login (request: Request, response: Response): Promise<void> {
        let user: User = await this.userService.getUser({email: request.body.email});
        if (user) {
            const match = await compare(request.body.password, user.password);
            if(match) {
                response.json(this.jwtManager.sign({
                    email: user.email,
                    userName: user.userName,
                    id: user.id
                }));
            } else{
                response.json(Errors.INVALID_LOGIN);    
            }
        } else {
            response.json(Errors.INVALID_LOGIN);
        }
    }
}