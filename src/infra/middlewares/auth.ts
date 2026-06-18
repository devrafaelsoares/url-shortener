import { UserRepository } from "@domain/protocols/repositories";
import { JwtAuthProvider } from "@domain/protocols/providers";
import { HttpStatus } from "@presentation/protocols";
import { FastifyReply, FastifyRequest } from "fastify";

type AuthMiddlewareProps = {
    readonly userRepository: UserRepository;
    readonly jwtAuthProvider: JwtAuthProvider;
};

declare module "fastify" {
    interface FastifyRequest {
        authenticatedUserId: string;
    }
}

export class AuthMiddleware {
    constructor(private props: AuthMiddlewareProps) {}

    async execute(request: FastifyRequest, reply: FastifyReply) {
        const moment = new Date();

        const apiKey = request.cookies["API_AUTH"] as string;

        if (!apiKey) {
            return this.unauthorized(request, reply, moment, "TOKEN_MISSING");
        }

        try {
            const decoded = this.props.jwtAuthProvider.verify<{ id: string; type: string }>(apiKey, "access");

            if (!decoded || !decoded.id) {
                return this.unauthorized(request, reply, moment, "INVALID_OR_EXPIRED_TOKEN");
            }

            const foundUser = await this.props.userRepository.findById(decoded.id);

            if (!foundUser) {
                return this.unauthorized(request, reply, moment, "USER_NOT_FOUND_OR_INACTIVE");
            }

            request.authenticatedUserId = decoded.id;
        } catch {
            return this.unauthorized(request, reply, moment, "EXCEPTION_DURING_VERIFICATION");
        }
    }

    private unauthorized(request: FastifyRequest, reply: FastifyReply, moment: Date, reason: string) {
        request.log.warn(
            {
                event: "AUTHENTICATION_FAILED",
                reason,
                ip: request.ip,
                method: request.method,
                url: request.url,
                moment: moment.toISOString(),
            },
            `[AppSec] Falha de autenticação interceptada: ${reason}`,
        );

        return reply.status(HttpStatus.UNAUTHORIZED).send({
            moment,
            success: false,
            data: {
                message: "Acesso não autorizado",
            },
            status_code: HttpStatus.UNAUTHORIZED,
        });
    }
}
