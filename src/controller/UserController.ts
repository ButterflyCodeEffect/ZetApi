import { getRepository, Repository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import UserValidator from "../helpers/UserValidator";
import toast from "../helpers/errorHandler";
import { EDESTADDRREQ } from "constants";

export class UserController {

    private userRepository: Repository<User>;
    private userValidator: UserValidator;

    public constructor () {
        this.userRepository = getRepository(User);
        this.userValidator = new UserValidator(this.userRepository);
    }

    async getAll () {
        return this.userRepository.find();
    }

    async createUser (req: Request, res: Response) {

        this.userValidator.isValid(req.body).then(errors => {            
            if (errors.length) {
                toast(errors, res);
            } else {
                let user = this.createUserObject(req.body);
                this.userRepository.save(user).then(results => {
                    res.json(results);
                });
            }
        })
    }

    private createUserObject (data: any) : User {
        let user = new User();
        user.userName = data.userName;
        user.password = data.password;
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.birthDate = new Date(data.birthDate);
        return user;
    }
}