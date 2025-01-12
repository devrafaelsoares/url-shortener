import { Either, error, success, TimeUtils } from "@/helpers";
import { UnauthorizedEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import jwt from "jsonwebtoken";
import env from "@env";
import { RevalidateUserRequestProps, RevalidateUserResponseTokenProps } from "@presentation/adpaters/user";

export class RevalidateUserUseCase {
    constructor() {}
    async execute({
        refresh_token,
    }: RevalidateUserRequestProps): Promise<Either<UnauthorizedEntityError, RevalidateUserResponseTokenProps>> {
        if (!refresh_token) {
            return error(new UnauthorizedEntityError("Refresh token é obrigatório.", HttpStatus.UNAUTHORIZED));
        }

        try {
            const decodedToken = jwt.verify(refresh_token, env.SECRET_KEY_AUTH) as {
                id: string;
            };

            const isValid = jwt.verify(refresh_token, env.SECRET_KEY_AUTH);

            if (!isValid) {
                return error(new UnauthorizedEntityError("Acesso não autorizado", HttpStatus.UNAUTHORIZED));
            }

            const tokenData = this.generateToken(decodedToken.id, env.SECRET_KEY_AUTH, env.TOKEN_DURATION);

            return success(tokenData);
        } catch (err) {
            return error(new UnauthorizedEntityError("Acesso não autorizadod", HttpStatus.UNAUTHORIZED));
        }
    }

    private generateToken(userId: string, secret: string, expiresIn: string): RevalidateUserResponseTokenProps {
        const now = new Date();
        const durationInSeconds = TimeUtils.parseDuration(expiresIn);
        if (!durationInSeconds) {
            throw new Error("Invalid expiresIn format");
        }

        const expires = new Date(now.getTime() + durationInSeconds * 1000);

        const token = jwt.sign({ id: userId }, secret, { expiresIn });

        return { value: token, expires };
    }
}
