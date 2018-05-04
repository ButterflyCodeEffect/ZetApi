import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class UserController {

    private userRepository = getRepository(User);

    async getAll () {
        return this.userRepository.find();
    }

    async createUser (req: Request, res: Response) {

        let user = new User();
        user.userName = req.body.userName;
        user.password = req.body.password;
        user.email = req.body.email;
        user.firstName = req.body.firstName;
        user.lastName = req.body.lastName;
        user.birthDate = new Date(req.body.birthDate);
        return this.userRepository.save(user);
    }



    // async all(request: Request, response: Response, next: NextFunction) {
    //     return this.userRepository.find();
    // }

    // async one(request: Request, response: Response, next: NextFunction) {
    //     return this.userRepository.findOne(request.params.id);
    // }

    // async save(request: Request, response: Response, next: NextFunction) {
    //     return this.userRepository.save(request.body);
    // }

    // async remove(request: Request, response: Response, next: NextFunction) {
    //     // await this.userRepository.removeById(request.params.id);
    // }

}