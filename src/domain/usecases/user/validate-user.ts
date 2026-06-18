import { Either, error, success } from "@/helpers";
import { InternalServerError, BadRequestEntityError, UnauthorizedEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { JwtAuthProvider } from "@domain/protocols/providers";
import { ValidateUserResponseProps } from "@presentation/adpaters/user";

type ValidateUserUseCaseProps = {
    readonly jwtAuthProvider: JwtAuthProvider;
};

export class ValidateUserUseCase {
    constructor(private props: ValidateUserUseCaseProps) {}

    async execute(
        token?: string
    ): Promise<Either<BadRequestEntityError | InternalServerError, ValidateUserResponseProps>> {
        if (!token) {
            return error(new UnauthorizedEntityError("Acesso não autorizado", HttpStatus.UNAUTHORIZED));
        }

        const decoded = this.props.jwtAuthProvider.verify(token, "access");

        if (!decoded) {
            return error(new UnauthorizedEntityError("Acesso não autorizado", HttpStatus.UNAUTHORIZED));
        }

        return success({
            token: {
                valid: true,
            },
        });
    }
}
