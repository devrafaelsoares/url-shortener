"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const email_1 = require("./email");
describe('Email', () => {
    it('should be able to create a email', () => {
        const emailProps = {
            from: 'from@email.com',
            subject: 'Subject',
            to: 'to@email.com',
            text: 'Text example',
        };
        const emailResult = email_1.Email.create(emailProps);
        expect(emailResult).toBeTruthy();
        expect(emailResult).toStrictEqual(expect.any(email_1.Email));
    });
});
