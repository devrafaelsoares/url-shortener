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
exports.UserInMemoryRepository = void 0;
class UserInMemoryRepository {
    constructor() {
        this.users = [];
    }
    save(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFoundIndex = this.users.findIndex(user => user.id === data.id);
            if (userFoundIndex >= 0) {
                this.users[userFoundIndex] = data;
                return 1;
            }
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.users.push(data);
            return data;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = this.users.find(user => user.id === id);
            if (!userFound) {
                return null;
            }
            return userFound;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = this.users.find(user => user.email === email);
            if (!userFound) {
                return null;
            }
            return userFound;
        });
    }
    find(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (field === "password") {
                return null;
            }
            const foundUser = this.users.filter(user => user[field] === value);
            return !foundUser.length ? null : foundUser;
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.users;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFoundIndex = this.users.findIndex(user => user.id === id);
            if (userFoundIndex >= 0) {
                this.users.splice(userFoundIndex, 1);
            }
        });
    }
}
exports.UserInMemoryRepository = UserInMemoryRepository;
