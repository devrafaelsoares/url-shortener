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
exports.FindShortUrlUseCase = void 0;
const mappers_1 = require("../../mappers");
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
class FindShortUrlUseCase {
    constructor(props) {
        this.props = props;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, }) {
            const foundUrl = yield this.props.urlRepository.findById(id);
            if (!foundUrl) {
                return (0, helpers_1.error)(new errors_1.NotFoundEntityError(errors_1.ErrorMessages.NOT_EXISTS_SHORT_URL, protocols_1.HttpStatus.NOT_FOUND));
            }
            return (0, helpers_1.success)(mappers_1.UrlMapper.toHttpResponse(foundUrl));
        });
    }
}
exports.FindShortUrlUseCase = FindShortUrlUseCase;
