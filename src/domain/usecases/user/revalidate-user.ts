import { Either, error, success } from "@/helpers";
import { UnauthorizedEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";
import { JwtAuthProvider } from "@domain/protocols/providers";
import { RevalidateUserRequestProps, RevalidateUserResponseTokenProps } from "@presentation/adpaters/user";

type RevalidateUserUseCaseProps = {
    readonly jwtAuthProvider: JwtAuthProvider;
};

export class RevalidateUserUseCase {
    constructor(private props: RevalidateUserUseCaseProps) {}

    async execute({
        refresh_token,
    }: RevalidateUserRequestProps): Promise<Either<UnauthorizedEntityError, RevalidateUserResponseTokenProps>> {
        if (!refresh_token) {
            return error(new UnauthorizedEntityError("Refresh token é obrigatório.", HttpStatus.UNAUTHORIZED));
        }

        const decoded = this.props.jwtAuthProvider.verify<{ id: string; type: string }>(refresh_token, "refresh");

        if (!decoded || !decoded.id) {
            return error(new UnauthorizedEntityError("Acesso não autorizado", HttpStatus.UNAUTHORIZED));
        }

        const { token, expiresAt } = this.props.jwtAuthProvider.sign({ id: decoded.id }, "access");

        return success({ value: token, expires: expiresAt });
    }
}
