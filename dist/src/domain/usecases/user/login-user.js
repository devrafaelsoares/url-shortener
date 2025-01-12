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
exports.LoginUserUseCase = void 0;
const helpers_1 = require("../../../helpers");
const errors_1 = require("../../../presentation/errors");
const protocols_1 = require("../../../presentation/protocols");
const _env_1 = __importDefault(require("../../../../env"));
const token_1 = require("../../../infra/providers/token");
class LoginUserUseCase {
    constructor(props) {
        this.props = props;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, }) {
            const LOGIN_BLOCK_KEY = `auth:login:block:${email}`;
            const LOGIN_ATTEMPTS_KEY = `auth:login:attempts:${email}`;
            const isBlocked = yield this.props.userMemoryRepository.userHasAccountBlocked(LOGIN_BLOCK_KEY);
            if (isBlocked) {
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError(errors_1.ErrorMessages.ACCOUNT_TEMPORARILY_BLOCKED, protocols_1.HttpStatus.FORBIDDEN));
            }
            const foundUser = yield this.props.userRepository.findByEmail(email);
            if (!foundUser) {
                yield this.handleFailedAttempt(LOGIN_ATTEMPTS_KEY, LOGIN_BLOCK_KEY);
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError(errors_1.ErrorMessages.INVALID_USER_PASSWORD, protocols_1.HttpStatus.UNAUTHORIZED));
            }
            if (!foundUser.isActive) {
                yield this.handleFailedAttempt(LOGIN_ATTEMPTS_KEY, LOGIN_BLOCK_KEY);
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError(errors_1.ErrorMessages.ACCOUNT_NOT_ACTIVATED, protocols_1.HttpStatus.UNAUTHORIZED));
            }
            const isSamePassword = yield this.props.passwordProvider.verify(password, foundUser.password);
            if (!isSamePassword) {
                yield this.handleFailedAttempt(LOGIN_ATTEMPTS_KEY, LOGIN_BLOCK_KEY);
                return (0, helpers_1.error)(new errors_1.UnauthorizedEntityError(errors_1.ErrorMessages.INVALID_USER_PASSWORD, protocols_1.HttpStatus.UNAUTHORIZED));
            }
            yield this.props.userMemoryRepository.removeAttemptLock(LOGIN_ATTEMPTS_KEY);
            const tokenData = this.generateToken(foundUser.id, _env_1.default.SECRET_KEY_AUTH, _env_1.default.TOKEN_DURATION);
            const refreshTokenData = this.generateToken(foundUser.id, _env_1.default.SECRET_KEY_AUTH, _env_1.default.REFRESH_TOKEN_DURATION);
            return (0, helpers_1.success)({
                token: tokenData,
                refresh_token: refreshTokenData,
                user_id: foundUser.id,
            });
        });
    }
    generateToken(userId, secret, expiresIn) {
        const now = new Date();
        const durationInSeconds = helpers_1.TimeUtils.parseDuration(expiresIn);
        if (!durationInSeconds) {
            throw new Error("Invalid expiresIn format");
        }
        const expires = new Date(now.getTime() + durationInSeconds * 1000);
        const jwtToken = new token_1.JwtToken({ secret, payload: { id: userId }, expirationTime: expiresIn });
        const { token } = jwtToken.generate();
        return { value: token, expires };
    }
    handleFailedAttempt(attemptsKey, blockKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const attempts = yield this.props.userMemoryRepository.addNewAttemptFails(attemptsKey);
            if (attempts === 1) {
                yield this.props.userMemoryRepository.addAttemptLock(attemptsKey, this.props.loginUserUseCaseConfig.blockDuration);
            }
            if (attempts >= this.props.loginUserUseCaseConfig.maxLoginAttempts) {
                yield this.props.userMemoryRepository.addTemporaryBlock(blockKey, "1", this.props.loginUserUseCaseConfig.blockDuration);
                yield this.props.userMemoryRepository.removeAttemptLock(attemptsKey);
            }
        });
    }
}
exports.LoginUserUseCase = LoginUserUseCase;
