import { getRepository, Repository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import UserValidator from "../helpers/UserValidator";
import toast from "../helpers/errorHandler";
import { hash }  from 'bcrypt';
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
        this.userValidator.isCreateValid(req.body).then(errors => {            
            if (errors.length) {
                toast(errors, res);
            } else {
                this.createUserObject(req.body).then(user => {
                    this.userRepository.save(user).then(results => {
                        res.json(results);
                    });
                });
            }
        })
    }

    async updateUser (req: Request, res: Response) {
        this.userValidator.isUpdateValid(req.body).then(errors => {
            
        })
    }   

    private async createUserObject (data: any) : Promise<User> {
        let user = new User();
        user.userName = data.userName;
        user.email = data.email;
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.birthDate = new Date(data.birthDate);
        await hash(data.password, 10).then(hash => {
            user.password = hash;
        });
        return user;
    }
}