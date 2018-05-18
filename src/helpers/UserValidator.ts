import { Repository } from "typeorm";
import { User } from '../entity/User';
import { Errors } from './errorCodes';
import { UserService } from "../services/UserService";
import { Request } from "express-serve-static-core";
import { Response } from "express";

export default class UserValidator {

    private readonly updateParams: string[] = ["id", "email", "firstName", "lastName", "birthDate"];
    private readonly createParams: string[] = [ "email", "firstName", "lastName", "birthDate", "password", "userName"];

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
    private readonly userNameRegex: RegExp = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{4,}$/;

    private userService: UserService;

    public constructor () {
        this.userService = new UserService();
    }

    public isCreateValid (req: Request, res: Response, next: Function) {
        const user = req.body;
        if (this.isParamsValid(user, this.createParams)){
            const promises: Promise<object>[] = [
                this.checkValueUnique({email: user.email}, Errors.EMAIL_EXISTS),
                this.checkValueUnique({userName: user.userName}, Errors.USERNAME_EXISTS),
                this.checkValueFormat(user.email, this.emailRegex, Errors.INVALID_EMAIL),
                this.checkValueFormat(user.birthDate, this.dateRegex, Errors.INVALID_BIRTHDATE_FORMAT),
                this.checkValueFormat(user.password, this.passwordRegex, Errors.INVALID_PASSWORD_FORMAT),
                this.checkValueFormat(user.userName, this.userNameRegex, Errors.INVALID_USERNAME_FORMAT)
            ];
    
            Promise.all(promises).then(results => {
                let errors = results.filter(result => {
                    return result !== null;
                })
                errors.length ? res.json(errors) : next();
            });
        } else {
            res.json(Errors.IVALID_PARAMS_COUNT)
        }
        
    }

    public isUpdateValid (req: Request, res: Response, next: Function) {
        const user = req.body;
        if (this.isParamsValid(user, this.updateParams)){

            this.checkIfUserExist(user.id).then((userEntity: User) => {
                const promises: Promise<object>[] = [
                    this.checkValueFormat(user.email, this.emailRegex, Errors.INVALID_EMAIL),
                    this.checkValueFormat(user.birthDate, this.dateRegex, Errors.INVALID_BIRTHDATE_FORMAT)
                ];

                if (userEntity.email !== user.email) {
                    promises.push(this.checkValueUnique({email: user.email}, Errors.EMAIL_EXISTS))
                }
        
                Promise.all(promises).then(results => {
                    let errors = results.filter(result => {
                        return result !== null;
                    })
                    errors.length ? res.json(errors) : next();
                });

            }).catch(err => {
                res.json(err);
            })

        } else {
            res.json(Errors.IVALID_PARAMS_COUNT)
        }
    }

    private isParamsValid (user: any, expectedParams: string[]): boolean {
        if (Object.keys(user).length !== expectedParams.length) {
            return false;
        }
        return Object.keys(user).every(key => {
            return (expectedParams.indexOf(key) !== -1) ? true : false;
        })
    }


    /**
     * @description
     * Checks if the value respects the regex format
     * @param val 
     * @param regex 
     * @param err error object from errorCodes
     */
    private async checkValueFormat (val: string, regex: RegExp, err: object): Promise<object> {
        return await regex.test(val) ? null : err;
    }

    /**
     * @description
     * checks if the value already exists in the database
     * 
     * @param params 
     * @param err error object from errorCodes
     */
    private async checkValueUnique(params: object, err: object, ): Promise<object> {
        return await this.userService.getUser(params).then(result => {
            return result ? err : null;            
        });
    }


    private checkIfUserExist (id: number): Promise<object> {
        return new Promise((resolve, reject) => {
            this.userService.getUser({id:id, deletedDate: null}).then(result => {
                 result ? resolve(result) : reject(Errors.USER_NOT_EXISTS);            
            });
        }) 
    }

    
}