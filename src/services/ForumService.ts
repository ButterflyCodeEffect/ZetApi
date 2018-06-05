import { Errors } from "../Helpers/Errors";
import { JwtManager } from "../Helpers/JwtManager";

export class ForumService {
    private readonly jwtManager: JwtManager;

    public constructor(jwtManager: JwtManager) {
        this.jwtManager = jwtManager;
    }
}