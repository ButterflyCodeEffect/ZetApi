import { hash, compare } from 'bcrypt';
import { Repository, getRepository } from "typeorm";

import { Errors } from "../Helpers/Errors";
import { JwtManager } from "../Helpers/JwtManager";
import { UserEntity } from "../entities/UserEntity";

export class UserService {
    private readonly jwtManager: JwtManager;

    public constructor(jwtManager: JwtManager) {
        this.jwtManager = jwtManager;
    }

    public async getUser(params: object): Promise<UserEntity> {
        let userRepository: Repository<UserEntity> = getRepository(UserEntity);
        return await userRepository.findOne(params);
    }

    public async listUsers(): Promise<UserEntity[]> {
        let userRepository: Repository<UserEntity> = getRepository(UserEntity);
        return await userRepository.find();
    }

    public async listUser(params: object): Promise<UserEntity | object> {
        let userEntity: UserEntity = await this.getUser(params);
        return await userEntity ? userEntity : Errors.USER_DOES_NOT_EXISTS;
    }

    public async createUser(user: UserEntity): Promise<UserEntity> {
        let userRepository: Repository<UserEntity> = getRepository(UserEntity);
        user.password = await hash(user.password, 10);
        return await userRepository.save(user);
    }

    public async updateUser(user: UserEntity): Promise<UserEntity | object> {
        let userRepository: Repository<UserEntity> = getRepository(UserEntity);
        let userEntity: UserEntity = await userRepository.findOne({ id: user.id });
        if (userEntity) {
            userEntity.birthDate = user.birthDate;
            userEntity.firstName = user.firstName;
            userEntity.lastName = user.lastName;
            userEntity.email = user.email;
            userEntity.password = user.password;
            return await userRepository.save(userEntity);
        }
        return await Errors.USER_DOES_NOT_EXISTS;
    }

    public async deleteUser(id: number): Promise<UserEntity | object> {
        let userRepository: Repository<UserEntity> = getRepository(UserEntity);
        let userEntity: UserEntity = await userRepository.findOne({ id: id });
        if (userEntity) {
            userEntity.deletedDate = new Date();
            return await userRepository.save(userEntity);
        }
        return await Errors.USER_DOES_NOT_EXISTS;
    }

    public async loginUser(params: any): Promise<any> {
        let userRepository: Repository<UserEntity> = getRepository(UserEntity);
        let userEntity: UserEntity = await userRepository.findOne({ email: params.email });
        if (userEntity) {
            let match: boolean = await compare(params.password, userEntity.password);
            if (match) {
                return await this.jwtManager.sign({
                    email: userEntity.email,
                    userName: userEntity.userName,
                    id: userEntity.id
                });
            }
            return await Errors.INVALID_LOGIN;
        }
        return await Errors.INVALID_LOGIN;
    }
}