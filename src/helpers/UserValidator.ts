import { Repository } from "typeorm";
import { User } from '../entity/User';
import { Errors } from './errorCodes';

export default class UserValidator {

    // Regex for validating the email format
    private readonly emailRegex:RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // Regex for validating the date format, valid dates are dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy, dd-mmm-YYYY, dd/mmm/YYYY, dd.mmm.YYYY
    private readonly dateRegex:RegExp = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

    /**
     * At least 8 characters
     * Must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number
     * Can contain special characters
     */
    private readonly passwordRegex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

    /**
     *  Usernames can contain characters a-z, 0-9, underscores and periods.
     *  The username cannot start with a period nor end with a period.
     *  It must also not have more than one period sequentially. 
     */
    private readonly userNameRegex: RegExp = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{5,}$/;

    private userRepository: Repository<User>;

    public constructor (repository: Repository<User>) {
        this.userRepository = repository;
    }

    public async isCreateValid (user: any) {

        const promises: Array<Promise<object>> = [
            this.checkValueUnique({email: user.email}, Errors.EMAIL_EXISTS),
            this.checkValueUnique({userName: user.userName}, Errors.USERNAME_EXISTS),
            this.checkValueFormat(user.email, this.emailRegex, Errors.INVALID_EMAIL),
            this.checkValueFormat(user.birthDate, this.dateRegex, Errors.INVALID_BIRTHDATE_FORMAT),
            this.checkValueFormat(user.password, this.passwordRegex, Errors.INVALID_PASSWORD_FORMAT),
            this.checkValueFormat(user.userName, this.userNameRegex, Errors.INVALID_USERNAME_FORMAT)
        ];

        return await Promise.all(promises).then(results => {
            return results.filter(result => {
                return result !== null;
            })
        });
    }

    public async isUpdateValid (user: any) {
        if(this.isParamsValid(user)) {

        }
    }

    private isParamsValid (user: any) {
        const validFields: Array<string> = ["id", "userName", "password", "email", "firstName", "lastName", "birthDate"];
        return Object.keys(user).every(key => {
            return (validFields.indexOf(key) !== -1) ? true : false;
        })
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