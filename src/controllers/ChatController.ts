import { Server } from "../Server";
import { Controller } from "./Controller";
import { ChatService } from "../services/ChatService";
import { ChatValidator } from "../validators/ChatValidator";

import { Application } from "express";
import * as socketIo from "socket.io"

export class ChatController implements Controller {
    private readonly chatValidator: ChatValidator;
    private readonly chatService: ChatService;
    private readonly ioServer: socketIo.Server;

    public constructor(server: Server) {
        this.chatValidator = new ChatValidator();
        this.ioServer = server.getSocketServer();
        this.chatService = new ChatService(server.getJwtManager());
    }

    public register(): void {
        this.ioServer.on("connect", this.handleConnection);
    }

    private handleConnection(socket: any): void {
        socket.on("message", this.handleMessage);
        socket.on("disconnect", this.handleDisconnect);
    }

    private handleMessage(message: any): void {
        this.ioServer.emit("message", message);
    }

    private handleDisconnect(): void {

    }
}