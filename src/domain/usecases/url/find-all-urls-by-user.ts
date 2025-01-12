import { UrlMapper } from "@domain/mappers";
import { UrlRepository, UserRepository } from "@domain/protocols/repositories";
import { Either, error, success } from "@/helpers";
import { FindAllUrlsByUserRequestProps, Paginate, UrlResponseProps } from "@presentation/adpaters";
import { BadRequestEntityError, ErrorMessages, NotFoundEntityError } from "@presentation/errors";
import { HttpStatus } from "@presentation/protocols";

type FindAllUrlsByUserUseCaseProps = {
    readonly urlRepository: UrlRepository;
    readonly userRepository: UserRepository;
};

export class FindAllUrlsByUserUseCase {
    constructor(private props: FindAllUrlsByUserUseCaseProps) {}

    async execute({
        limit,
        page,
        user_id,
    }: FindAllUrlsByUserRequestProps): Promise<
        Either<BadRequestEntityError | NotFoundEntityError, Paginate<UrlResponseProps>>
    > {
        if (page < 1) {
            return error(new BadRequestEntityError(ErrorMessages.PAGE_LESS_THAN_ONE, HttpStatus.BAD_REQUEST));
        }

        const foundUser = await this.props.userRepository.findById(user_id);

        if (!foundUser) {
            return error(new NotFoundEntityError(ErrorMessages.NOT_EXISTS_USER, HttpStatus.NOT_FOUND));
        }

        const countUrls = await this.props.urlRepository.countByUser(user_id);

        const pages = Math.ceil(countUrls / limit);

        if (page > pages) {
            return error(new BadRequestEntityError(ErrorMessages.PAGE_LARGER_THAN_LIMIT, HttpStatus.BAD_REQUEST));
        }

        const foundUrls = await this.props.urlRepository.findPaginatedByUser(page, limit, user_id);

        return success({
            items: foundUrls.map(UrlMapper.toHttpResponse),
            page,
            limit,
            pages,
            total: countUrls,
        });
    }
}
