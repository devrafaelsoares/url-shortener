import { Email, EmailProps } from './email';

describe('Email', () => {
    it('should be able to create a email', () => {
        const emailProps: EmailProps = {
            from: 'from@email.com',
            subject: 'Subject',
            to: 'to@email.com',
            text: 'Text example',
        };

        const emailResult = Email.create(emailProps);

        expect(emailResult).toBeTruthy();
        expect(emailResult).toStrictEqual(expect.any(Email));
    });
});
