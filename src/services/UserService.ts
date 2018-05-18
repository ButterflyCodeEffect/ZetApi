import { User } from "../entity/User";
import { Repository, getRepository, DeleteResult } from "typeorm";

export class UserService {
    public constructor() {}

    public async listUsers(): Promise<User[]> {
        let userRepository: Repository<User> = getRepository(User);
        return await userRepository.find();
    }

    public async getUser(params: object): Promise<User> {
        let userRepository: Repository<User> = getRepository(User);
        return await userRepository.findOne(params);
    }

    public async createUser(user: User): Promise<User> {
        let userRepository: Repository<User> = getRepository(User);
        return await userRepository.save(user);
    }

    public async updateUser(user: User): Promise<User> {
        let userRepository: Repository<User> = getRepository(User);
        let entity = await userRepository.findOne({id: user.id});
        entity.birthDate = user.birthDate;
        entity.firstName = user.firstName;
        entity.lastName = user.lastName;
        entity.email = user.email;
        entity.password = user.password;
        return await userRepository.save(entity);
    }

    public async deleteUser(id: number): Promise<User> {
        let userRepository: Repository<User> = getRepository(User);
        let entity = await userRepository.findOne({id: id});
        entity.deletedDate = new Date();
        return await userRepository.save(entity);
    }
}