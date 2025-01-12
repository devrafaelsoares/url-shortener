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
    HasMany,
} from "sequelize-typescript";
import HashingAlgorithm from "./hashing-algorithm";
import VerificationToken from "./verification-token";
import Url from "./url";

@Table({ tableName: "users" })
export default class User extends Model {
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

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        field: "hash_salt",
        allowNull: true,
    })
    declare hashSalt: string;

    @Column({
        type: DataType.BOOLEAN,
        field: "is_active",
        allowNull: true,
    })
    declare isActive: boolean;

    @ForeignKey(() => HashingAlgorithm)
    @Column({
        type: DataType.STRING,
        field: "hashing_algorithm_id",
    })
    declare hashingAlgorithmId: string;

    @BelongsTo(() => HashingAlgorithm)
    declare hashingAlgorithm: HashingAlgorithm;

    @HasMany(() => VerificationToken)
    declare verificationTokens: VerificationToken[];

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

    @HasMany(() => Url)
    declare urls: Url[];
}
