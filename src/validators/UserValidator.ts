import { Errors } from "../Helpers/Errors";
import { UserEntity } from "../entities/UserEntity";
import { UserService } from "../services/UserService";

import { Request, Response } from "express";

export class UserValidator {
    private readonly updateParams: string[] = ["id", "email", "firstName", "lastName", "birthDate"];
    private readonly createParams: string[] = ["email", "firstName", "lastName", "birthDate", "password", "rePassword", "userName"];
    private readonly emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    private readonly dateRegex: RegExp = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]|(?:Jan|Mar|May|Jul|Aug|Oct|Dec)))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2]|(?:Jan|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec))\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)(?:0?2|(?:Feb))\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9]|(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep))|(?:1[0-2]|(?:Oct|Nov|Dec)))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    private readonly passwordRegex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    private readonly userNameRegex: RegExp = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{4,}$/;
    private readonly userService: UserService;

    public constructor(userService: UserService) {
        this.userService = userService;
    }

    public validateCreate(request: Request, response: Response, next: Function): void {
        let user: any = request.body;
        if (this.checkParamsValid(user, this.createParams)) {
            let promises: Promise<object>[] = [
                this.checkMatchingStrings(user.password, user.rePassword, Errors.PASSWORDS_MISSMATCH),
                this.checkValueUnique({ email: user.email }, Errors.EMAIL_EXISTS),
                this.checkValueUnique({ userName: user.userName }, Errors.USERNAME_EXISTS),
                this.checkValueFormat(user.email, this.emailRegex, Errors.INVALID_EMAIL),
                this.checkValueFormat(user.birthDate, this.dateRegex, Errors.INVALID_BIRTHDATE_FORMAT),
                this.checkValueFormat(user.password, this.passwordRegex, Errors.INVALID_PASSWORD_FORMAT),
                this.checkValueFormat(user.userName, this.userNameRegex, Errors.INVALID_USERNAME_FORMAT)
            ];
            Promise.all(promises).then(results => {
                let errors = results.filter(result => {
                    return result !== null;
                })
                errors.length ? response.json(errors) : next();
            });
        } else {
            response.json(Errors.IVALID_PARAMS_COUNT)
        }
    }

    public validateUpdate(request: Request, response: Response, next: Function): void {
        let user: any = request.body;
        if (this.checkParamsValid(user, this.updateParams)) {
            this.userService.getUser({ id: user.id, deletedDate: null }).then((userEntity: UserEntity) => {
                if (userEntity) {
                    let promises: Promise<object>[] = [
                        this.checkValueFormat(user.email, this.emailRegex, Errors.INVALID_EMAIL),
                        this.checkValueFormat(user.birthDate, this.dateRegex, Errors.INVALID_BIRTHDATE_FORMAT)
                    ];
                    if (userEntity.email !== user.email) {
                        promises.push(this.checkValueUnique({ email: user.email }, Errors.EMAIL_EXISTS))
                    }
                    Promise.all(promises).then(results => {
                        let errors = results.filter(result => {
                            return result !== null;
                        })
                        errors.length ? response.json(errors) : next();
                    });
                } else {
                    response.json(Errors.USER_DOES_NOT_EXISTS);
                }
            });
        } else {
            response.json(Errors.IVALID_PARAMS_COUNT);
        }
    }

    private checkParamsValid(user: any, expectedParams: string[]): boolean {
        if (Object.keys(user).length !== expectedParams.length) {
            return false;
        }
        return Object.keys(user).every(key => {
            return (expectedParams.indexOf(key) !== -1) ? true : false;
        });
    }

    private async checkValueFormat(val: string, regex: RegExp, error: object): Promise<object> {
        return await regex.test(val) ? null : error;
    }

    private async checkValueUnique(params: object, error: object): Promise<object> {
        return await this.userService.getUser(params).then(result => {
            return result ? error : null;
        });
    }

    private async checkMatchingStrings(leftValue: string, rightValue: string, error: object): Promise<object> {
        return await leftValue === rightValue ? null : error;
    }
}