import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    HasMany,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import UrlLog from "./url-log";
import User from "./user";

@Table({ tableName: "urls" })
export default class Url extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
    })
    declare id: string;

    @Column({
        type: DataType.STRING(255),
        field: "original_url",
        allowNull: false,
    })
    declare originalUrl: string;

    @Column({
        type: DataType.STRING(255),
        field: "short_url",
        allowNull: false,
    })
    declare shortUrl: string;

    @Column({
        type: DataType.BIGINT,
        defaultValue: 0,
        field: "hit_count",
        allowNull: false,
    })
    declare hitCount: number;

    @Column({
        type: DataType.DATE,
        field: "expires_at",
        allowNull: true,
    })
    declare expiresAt: Date;

    @ForeignKey(() => User)
    @Column({
        type: DataType.TEXT,
        field: "user_id",
        allowNull: true,
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

    @HasMany(() => UrlLog)
    declare urlsLog: UrlLog[];
}
