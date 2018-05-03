import { getRepository } from 'typeorm';
import User from '../entity/User';

export default class UserController {

    public getAllUsers () {
        return new Promise( (resolve, reject) => {
            resolve(getRepository<User>(User).find())
        });
    }

    public createUser () {
        let user = new User();
        user.firstName = "Ciuri";
        user.lastName = "Buri";
        user.age = 123;
        
        return getRepository<User>(User).save(user);
        
    }

}