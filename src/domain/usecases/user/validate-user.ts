import { Either, error, success } from "@/helpers";
import {
    InternalServerError,
    NotFoundEntityError,
    BadRequestEntityError,
    UnauthorizedEntityError,
} from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import jwt from "jsonwebtoken";
import env from "@env";
import { ValidateUserResponseProps } from "@presentation/adpaters/user";

export class ValidateUserUseCase {
    constructor() {}
    async execute(
        token?: string
    ): Promise<Either<NotFoundEntityError | BadRequestEntityError | InternalServerError, ValidateUserResponseProps>> {
        if (!token) {
            return error(new UnauthorizedEntityError("Acesso não autorizado", HttpStatus.UNAUTHORIZED));
        }

        try {
            const isValid = jwt.verify(token, env.SECRET_KEY_AUTH);

            if (!isValid) {
                return error(new UnauthorizedEntityError("Acesso não autorizado", HttpStatus.UNAUTHORIZED));
            }

            return success({
                token: {
                    valid: true,
                },
            });
        } catch (err) {
            return error(new UnauthorizedEntityError("Acesso não autorizado", HttpStatus.UNAUTHORIZED));
        }
    }
}
