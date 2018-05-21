import { sign as jwtSign, verify as jwtVerify }  from 'jsonwebtoken'
import { Request, Response } from 'express';


export class JwtManager {

    private readonly JWT_EXPIRE: number = 1440; // 24 H
    private readonly SECRET_KEY: string = "super secret key";

    sign (payload: object, expireTime?: number) {
        if (payload) {
            let expire = expireTime ? expireTime  : this.JWT_EXPIRE;     
            return jwtSign(payload, this.SECRET_KEY, {
                expiresIn: expire 
            });
        }
        return null;    
    }

    verify (req: Request, res: Response, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];  
        if (token) {
            jwtVerify(token, this.SECRET_KEY, function(err, decoded) {
                if(err) {
                    res.json("inavild token")
                }else {
                    req.params.jwtDecoded = decoded;
                    next();
                }                  
            });  
        }else{
            res.json("inavild token")
        }

        next();
        
    }
}