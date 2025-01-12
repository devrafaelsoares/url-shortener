import { Url as UrlSequelize } from "@infra/database/sequelize/models";
import { Url, UrlPropsCreate, User } from "@domain/entities";
import { ValidationError, Validator } from "@domain/protocols/validators";
import { Either, error, success } from "@/helpers";
import { CreateUrlRequestProps, Paginate, UrlResponseProps } from "@presentation/adpaters";

export class UrlMapper {
    static toDomain(urlSequelize: UrlSequelize): Url {
        const { id, originalUrl, shortUrl, hitCount, expiresAt, createdAt, updatedAt } = urlSequelize;

        const urlResult = Url.create({
            props: {
                originalUrl,
                shortUrl,
                hitCount,
                expiresAt,
                createdAt,
                updatedAt,
            },
            providers: undefined,
            validator: undefined,
            id,
        });

        const url = urlResult.value as Url;

        return url;
    }

    static toDomainWithValidation(
        request: CreateUrlRequestProps,
        user: User,
        urlValidation: Validator<UrlPropsCreate>,
        urlId?: string
    ): Either<ValidationError<UrlPropsCreate>[], Url> {
        const { original_url } = request;

        const urlPropsCreate: UrlPropsCreate = {
            originalUrl: original_url,
        };

        const urlResult = Url.create({
            props: urlPropsCreate,
            validator: urlValidation,
            id: urlId,
        });

        if (urlResult.isError()) {
            return error(urlResult.value);
        }

        const url = urlResult.value;

        return success(url);
    }

    static toHttpResponse(url: Url): UrlResponseProps {
        return {
            id: url.id,
            original_url: url.originalUrl,
            short_url: url.shortUrl,
            hit_count: url.hitCount,
            expires_at: url.expiresAt,
            created_at: url.createdAt,
        };
    }
}
