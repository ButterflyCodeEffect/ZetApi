import { Repository, getConnectionManager } from 'typeorm';
import User from '../entity/User';

export default class UserController {

    private userRepository: Repository<User>;

    public constructor () {
        this.userRepository = getConnectionManager().get().getRepository(User);
    }

    public getAllUsers () {
        return new Promise( (resolve, reject) => {
            resolve(this.userRepository.find())
        });
    }

    public createUser () {
        let user = new User();
        user.firstName = "Ciuri";
        user.lastName = "Buri";
        user.age = 123;
        return this.userRepository.save(user);
        
    }

}