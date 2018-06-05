import { Errors } from './Errors';

import { Request, Response } from 'express';
import { sign as jwtSign, verify as jwtVerify } from "jsonwebtoken";

export class JwtManager {
    private readonly JWT_EXPIRE: number = 1440; // 24 H
    private readonly SECRET_KEY: string = "super secret key";

    public sign(payload: object, expireTime?: number): string {
        let expire = expireTime ? expireTime : this.JWT_EXPIRE;
        return jwtSign(payload, this.SECRET_KEY, {
            expiresIn: expire
        });
    }

    public verify(request: Request, response: Response, next: Function): void {
        var token = request.body.token || request.query.token || request.headers["x-access-token"];
        if (token) {
            jwtVerify(token, this.SECRET_KEY, function (error, decoded) {
                if (error) {
                    response.json(Errors.IVALID_JWT_TOKEN)
                } else {
                    request.params.jwtDecoded = decoded;
                    next();
                }
            });
        } else {
            response.json(Errors.MISSING_JWT_TOKEN);
        }
    }
}