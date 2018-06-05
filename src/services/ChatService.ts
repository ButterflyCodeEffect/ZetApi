import { Errors } from "../Helpers/Errors"
import { JwtManager } from "../Helpers/JwtManager";

import { Server } from "socket.io";

export class ChatService {
    private readonly jwtManager: JwtManager;

    public constructor(jwtManager: JwtManager) {
        this.jwtManager = new JwtManager();
    }
}