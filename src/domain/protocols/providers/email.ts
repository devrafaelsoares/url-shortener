import { Email } from '@domain/entities';
import { Either } from '@/helpers';

export interface EmailService {
    send(data: Email): Promise<Either<Error, Email | void>>;
}
