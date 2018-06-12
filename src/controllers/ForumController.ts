import { Application, Request, Response } from "express";

import { Server } from "../Server";
import { Controller } from "./Controller";
import { ForumService } from "../services/ForumService";
import { ForumValidator } from "../validators/ForumValidator";



export class ForumController implements Controller {
    private readonly application: Application;
    private readonly forumService: ForumService;
    private readonly forumValidator: ForumValidator;

    public constructor(server: Server) {
        this.forumService = new ForumService(server.getJwtManager());
        this.forumValidator = new ForumValidator();
    }

    public register(): void {

    }
}