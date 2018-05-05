import { Repository } from "typeorm";
import { User } from '../entity/User';
import { Errors } from './errorCodes';

export default class UserValidator {

    private readonly emailRegex:RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    private readonly dateRegex:RegExp = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    private userRepository: Repository<User>;

    public constructor (repository: Repository<User>) {
        this.userRepository = repository;
    }

    public async isValid (user: any) {

        const promises: Array<Promise<object>> = [
            this.checkValueUnique({email: user.email}, Errors.EMAIL_EXISTS),
            this.checkValueUnique({userName: user.userName}, Errors.USERNAME_EXISTS),
            this.checkValueFormat(user.email, this.emailRegex, Errors.INVALID_EMAIL),
            this.checkValueFormat(user.birthDate, this.dateRegex, Errors.INVALID_BIRTHDATE_FORMAT)
        ];

        return await Promise.all(promises).then(results => {
            return results.filter(result => {
                return result !== null;
            })
        });
    }

    /**
     * @description
     * Checks if the value respects the regex format
     * @param val 
     * @param regex 
     * @param err error object from errorCodes
     */
    private async checkValueFormat (val: string, regex: RegExp, err: object) {
        return await regex.test(val) ? null : err;
    }

    /**
     * @description
     * checks if the value already exists in the database
     * 
     * @param val 
     * @param err error object from errorCodes
     */
    private async checkValueUnique (val: object, err: object) {
        return await this.userRepository.findOne(val).then(result => {
            return result ? err : null;            
        })
    }

    
}