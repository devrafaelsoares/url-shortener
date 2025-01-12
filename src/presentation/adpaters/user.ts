export type UserResponseProps = {
    id: string;
    name: string;
    email: string;
    created_at: Date;
};

export type UserCreateResponseProps = {
    id: string;
    token: string;
};

export type TokenProps = {
    value: string;
    expires: Date;
};

export type CreateUserRequestProps = Omit<UserResponseProps, "id" | "created_at"> & {
    password: string;
};

export type SendConfirmationAccountRequestProps = Pick<UserResponseProps, "id">;

export type SendRecoverPasswordRequestProps = Pick<UserResponseProps, "email">;

type ConfirmTokenRequestProps = {
    id: string;
    token: string;
};

export type ConfirmAccountRequestProps = ConfirmTokenRequestProps;

export type ConfirmRecoverPasswordRequestProps = ConfirmTokenRequestProps;

export type RecoverChangePasswordRequestProps = {
    user_id: string;
    token: string;
    new_password: string;
};

export type LoginUserRequestProps = {
    email: string;
    password: string;
};

export type RevalidateUserRequestProps = {
    refresh_token: string;
};

export type LoginUserResponseTokenProps = TokenProps;

export type RevalidateUserResponseTokenProps = TokenProps;

export type LoginUserResponseProps = {
    token: LoginUserResponseTokenProps;
    refresh_token: LoginUserResponseTokenProps;
    user_id: string;
};

export type ValidateUserResponseProps = {
    token: {
        valid: boolean;
    };
};

export type PayloadUserProps = {
    id: string;
};
