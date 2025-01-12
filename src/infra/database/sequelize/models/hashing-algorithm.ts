import { Table, Column, Model, DataType, PrimaryKey, CreatedAt, UpdatedAt, HasOne } from "sequelize-typescript";
import User from "./user";

@Table({ tableName: "hashing_algorithms" })
export default class HashingAlgorithm extends Model {
    @PrimaryKey
    @Column({
        type: DataType.STRING,
    })
    declare id: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    declare name: string;

    @HasOne(() => User)
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
