import {UserController} from "./controller/UserController";
const middlewarePlaceHolder = function (req, res, next) {next();}

export const Routes = [{
    method: "get",
    route: "/users",
    middleware: "empty",
    controller: UserController,
    action: "getAll"
}, {
    method: "post",
    route: "/user/create",    
    middleware: "validateUser",
    controller: UserController,
    action: "createUser"
}, {
    method: "put",
    route: "/user/update",
    middleware: "empty",
    controller: UserController,
    action: "updateUser"
}];