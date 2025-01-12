import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    BelongsTo,
    ForeignKey,
} from "sequelize-typescript";
import User from "./user";

@Table({ tableName: "verification_tokens" })
export default class VerificationToken extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
    })
    declare id: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare token: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare type: string;

    @Column({
        type: DataType.DATE,
        field: "expires_at",
    })
    declare expiresAt: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.STRING,
        field: "user_id",
    })
    declare userId: string;

    @BelongsTo(() => User)
    declare user: User;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        field: "created_at",
    })
    declare createdAt: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        field: "updated_at",
    })
    declare updatedAt: Date;
}
