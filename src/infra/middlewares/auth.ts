import { UserRepository } from "@domain/protocols/repositories";
import { HttpStatus } from "@presentation/protocols";
import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import env from "@env";

type AuthMiddlewareProps = {
    readonly userRepository: UserRepository;
};

export class AuthMiddleware {
    constructor(private props: AuthMiddlewareProps) {}

    async execute(request: FastifyRequest, reply: FastifyReply) {
        const moment = new Date();
        const apiKey = request.cookies["API_AUTH"] as string;
        if (!apiKey) {
            return reply.status(HttpStatus.UNAUTHORIZED).send({
                moment,
                success: false,
                data: {
                    message: "Acesso não autorizado",
                },
                status_code: HttpStatus.UNAUTHORIZED,
            });
        }

        try {
            const decodedToken = jwt.verify(apiKey, env.SECRET_KEY_AUTH) as {
                id: string;
            };

            const foundUser = await this.props.userRepository.findById(decodedToken.id);

            if (!foundUser) {
                return reply.status(HttpStatus.UNAUTHORIZED).send({
                    moment,
                    success: false,
                    data: {
                        message: "Acesso não autorizado",
                    },
                    status_code: HttpStatus.UNAUTHORIZED,
                });
            }
        } catch (err) {
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
}
