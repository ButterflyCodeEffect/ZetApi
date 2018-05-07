import { getRepository, Repository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";
import UserValidator from "../helpers/UserValidator";
import toast from "../helpers/errorHandler";
import { hash }  from 'bcrypt';

export class UserController {

    private userRepository: Repository<User>;

    public constructor () {
        this.userRepository = getRepository(User);
    }

    async getAll () {
        return this.userRepository.find();
    }

    async createUser (req: Request, res: Response) {
        this.createUserObject(req.body).then(user => {
            this.userRepository.save(user).then(results => {
                res.json(results);
            });
        });
    }

    async updateUser (req: Request, res: Response, next) {
        console.log("enered in update");
        res.json("meh")
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