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
exports.FindOriginalUrlUseCase = void 0;
const mappers_1 = require("../../mappers");
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
const entities_1 = require("../../entities");
class FindOriginalUrlUseCase {
    constructor(props) {
        this.props = props;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ short_url, ip_address, user_agent, }) {
            const foundUrl = yield this.props.urlRepository.findByShortUrl(short_url);
            const currentDate = new Date();
            if (!foundUrl) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_SHORT_URL, protocols_1.HttpStatus.NOT_FOUND));
            }
            const isExpiredUrl = foundUrl.expiresAt && foundUrl.expiresAt.getTime() <= currentDate.getTime();
            if (isExpiredUrl) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_SHORT_URL, protocols_1.HttpStatus.NOT_FOUND));
            }
            const urlLogProps = {
                ipAddress: ip_address,
                userAgent: user_agent,
                accessedAt: currentDate,
                urlId: foundUrl.id,
            };
            const urlLogResult = entities_1.UrlLog.create({
                props: urlLogProps,
                providers: { idProvider: this.props.idProvider },
                validator: this.props.urlLogValidator,
            });
            if (urlLogResult.isError()) {
                return (0, helpers_1.error)(urlLogResult.value);
            }
            const urlLog = urlLogResult.value;
            yield this.props.urlMemoryRepository.incrementAccessCount(foundUrl.id);
            yield this.props.urlRepository.incrementAccessCount(foundUrl.id);
            yield this.props.urlLogRepository.create(urlLog);
            return (0, helpers_1.success)(mappers_1.UrlMapper.toHttpResponse(foundUrl));
        });
    }
}
exports.FindOriginalUrlUseCase = FindOriginalUrlUseCase;
