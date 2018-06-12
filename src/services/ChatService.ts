import { Server } from "socket.io";

import { Errors } from "../Helpers/Errors"
import { JwtManager } from "../Helpers/JwtManager";

export class ChatService {
    private readonly jwtManager: JwtManager;

    public constructor(jwtManager: JwtManager) {
        this.jwtManager = new JwtManager();
    }
}