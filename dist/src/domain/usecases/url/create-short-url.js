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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateShortUrlUseCase = void 0;
const entities_1 = require("../../entities");
const mappers_1 = require("../../mappers");
const helpers_1 = require("../../../helpers");
const url_shortener_1 = require("../../../infra/providers/url-shortener");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
const token_1 = require("../../../infra/providers/token");
const _env_1 = __importDefault(require("../../../../env"));
class CreateShortUrlUseCase {
    constructor(props) {
        this.props = props;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ original_url, token, }) {
            if (!token) {
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError(errors_1.ErrorMessages.ACCESS_DENIED, protocols_1.HttpStatus.UNAUTHORIZED));
            }
            const { payload } = new token_1.JwtToken({ secret: _env_1.default.SECRET_KEY_AUTH, token });
            if (!payload) {
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError(errors_1.ErrorMessages.ACCESS_DENIED, protocols_1.HttpStatus.UNAUTHORIZED));
            }
            const foundUser = yield this.props.userRepository.findById(payload.id);
            if (!foundUser) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_USER, protocols_1.HttpStatus.NOT_FOUND));
            }
            const urlProps = {
                originalUrl: original_url,
                userId: foundUser.id,
                user: foundUser,
            };
            const urlResult = entities_1.Url.create({
                props: urlProps,
                providers: {
                    idProvider: this.props.idProvider,
                    urlShortenerProvider: new url_shortener_1.UrlShortenerToBase(this.props.toBaseProvider, this.props.idProviderUrlShortener),
                },
                validator: this.props.urlValidator,
            });
            if (urlResult.isError()) {
                return (0, helpers_1.error)(urlResult.value);
            }
            const url = urlResult.value;
            const foundUrl = yield this.props.urlRepository.findByShortUrl(url.shortUrl);
            if (foundUrl) {
                return (0, helpers_1.error)(new errors_1.ExistsEntityError(errors_1.ErrorMessages.EXISTS_URL, protocols_1.HttpStatus.CONFLIT));
            }
            const createdUrl = yield this.props.urlRepository.create(url);
            return (0, helpers_1.success)(mappers_1.UrlMapper.toHttpResponse(createdUrl));
        });
    }
}
exports.CreateShortUrlUseCase = CreateShortUrlUseCase;
