import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import Url from "./url";

@Table({ tableName: "urls_log" })
export default class UrlLog extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
    })
    declare id: string;

    @Column({
        type: DataType.STRING(255),
        field: "ip_address",
        allowNull: false,
    })
    declare ipAddress: string;

    @Column({
        type: DataType.STRING(255),
        field: "user_agent",
        allowNull: false,
    })
    declare userAgent: string;

    @Column({
        type: DataType.DATE,
        field: "accessed_at",
        allowNull: true,
    })
    declare accessedAt: Date;

    @ForeignKey(() => Url)
    @Column({
        type: DataType.TEXT,
        field: "url_id",
        allowNull: true,
    })
    declare urlId: string;

    @BelongsTo(() => Url)
    declare url: Url;

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
