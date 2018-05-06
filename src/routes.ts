import {UserController} from "./controller/UserController";

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "getAll"
}, {
    method: "post",
    route: "/user/create",
    controller: UserController,
    action: "createUser"
}, {
    method: "put",
    route: "/user/update",
    controller: UserController,
    action: "updateUser"
}];