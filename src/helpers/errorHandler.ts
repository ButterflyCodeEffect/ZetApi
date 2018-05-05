import { Response } from "express";

export default function toast (msg:Array<object>, res: Response, status: number = 406, log:boolean = false): void {
    res.status(status);
    res.json(msg);
    if ( log ) {
        console.log(msg, status);
    }
}