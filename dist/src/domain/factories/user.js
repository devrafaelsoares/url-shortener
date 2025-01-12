"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.UserFactory = void 0;
const entities_1 = require("../entities");
const crypto = __importStar(require("crypto"));
class UserFactory {
    constructor(idProvider, passwordProviderConfig) {
        this.idProvider = idProvider;
        this.passwordProviderConfig = passwordProviderConfig;
    }
    createProps() {
        return __awaiter(this, arguments, void 0, function* (overrides = {}) {
            var _a, _b, _c, _d, _e, _f, _g;
            const hashingAlgorithm = yield entities_1.HashingAlgorithm.create({
                props: { name: this.passwordProviderConfig.provider.method },
                idProvider: this.idProvider,
            });
            return Object.assign({ name: "Default User", email: "user@domain.com", password: yield this.passwordProviderConfig.provider.hash(crypto.randomBytes(8).toString("base64")), hashSalt: (_a = overrides.hashSalt) !== null && _a !== void 0 ? _a : this.passwordProviderConfig.salt, isActive: (_b = overrides.isActive) !== null && _b !== void 0 ? _b : false, hashingAlgorithm: (_c = overrides.hashingAlgorithm) !== null && _c !== void 0 ? _c : hashingAlgorithm, verificationTokens: (_d = overrides.verificationTokens) !== null && _d !== void 0 ? _d : [], urls: (_e = overrides.urls) !== null && _e !== void 0 ? _e : [], createdAt: (_f = overrides.createdAt) !== null && _f !== void 0 ? _f : new Date(), updatedAt: (_g = overrides.updatedAt) !== null && _g !== void 0 ? _g : new Date() }, overrides);
        });
    }
    createEntity() {
        return __awaiter(this, arguments, void 0, function* (overrides = {}, validator) {
            const userProps = yield this.createProps(overrides); // Aguarda a criação das propriedades
            const userCreationParams = {
                props: userProps,
                idProvider: this.idProvider,
                passwordProviderConfig: this.passwordProviderConfig,
                validator,
            };
            const user = yield entities_1.User.create(userCreationParams);
            return user;
        });
    }
}
exports.UserFactory = UserFactory;
