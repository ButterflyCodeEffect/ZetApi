import { getRepository, Repository } from "typeorm";
import UserValidator from "./UserValidator";
import { User } from "../entity/User";
import { Request, Response } from "express-serve-static-core";
import toast from "./errorHandler";

export default class MiddlewareHandler {

    private userRepository: Repository<User>;
    private userValidator: UserValidator;

    public constructor () {
        this.userRepository = getRepository(User);
        this.userValidator = new UserValidator(this.userRepository);
    }

    validateUser (req: Request, res: Response, next: Function) {
        this.userValidator.isCreateValid(req.body).then(errors => {            
            if (errors.length) {
                toast(errors, res);
            } else {
               next()
            }
        })
    }

    empty (req: Request, res: Response, next: Function) {next()}

}