import env from "@env";
import { Sequelize, SequelizeOptions } from "sequelize-typescript";
import { HashingAlgorithm, User, VerificationToken, Url, UrlLog } from "./models";

const isProduction = env.NODE_ENV === "production" ? true : false;

const sequelizeOptionsDevelopmentPostgres: SequelizeOptions = {
    username: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
    },
    host: env.DATABASE_HOST,
    dialect: "postgres",
    logging: isProduction ? false : console.log,
    dialectOptions: {
        ssl: true,
    },
    timezone: "America/Sao_Paulo",
    models: [Url, UrlLog, User, HashingAlgorithm, VerificationToken],
};

export default new Sequelize(sequelizeOptionsDevelopmentPostgres);
