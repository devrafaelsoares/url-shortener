"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllUrlsByUserUseCase = void 0;
const mappers_1 = require("../../mappers");
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
class FindAllUrlsByUserUseCase {
    constructor(props) {
        this.props = props;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ limit, page, user_id, }) {
            if (page < 1) {
                return (0, helpers_1.error)(new errors_1.BadRequestEntityError(errors_1.ErrorMessages.PAGE_LESS_THAN_ONE, protocols_1.HttpStatus.BAD_REQUEST));
            }
            const foundUser = yield this.props.userRepository.findById(user_id);
            if (!foundUser) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_USER, protocols_1.HttpStatus.NOT_FOUND));
            }
            const countUrls = yield this.props.urlRepository.countByUser(user_id);
            const pages = Math.ceil(countUrls / limit);
            if (page > pages) {
                return (0, helpers_1.error)(new errors_1.BadRequestEntityError(errors_1.ErrorMessages.PAGE_LARGER_THAN_LIMIT, protocols_1.HttpStatus.BAD_REQUEST));
            }
            const foundUrls = yield this.props.urlRepository.findPaginatedByUser(page, limit, user_id);
            return (0, helpers_1.success)({
                items: foundUrls.map(mappers_1.UrlMapper.toHttpResponse),
                page,
                limit,
                pages,
                total: countUrls,
            });
        });
    }
}
exports.FindAllUrlsByUserUseCase = FindAllUrlsByUserUseCase;
