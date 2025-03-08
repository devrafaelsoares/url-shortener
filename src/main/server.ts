import "module-alias/register";
import "@lib/module-alias";
import env from "@env";
import os from "os";
import app from "@main/fastify/app";
import sequelize from "@infra/database/sequelize";
import redisClient from "@infra/database/redis";

async function getSystemInfo() {
    return {
        nodeVersion: process.version,
        platform: process.platform,
        architecture: process.arch,
        cpus: os.cpus().length,
        memory: os.totalmem(),
        freeMemory: os.freemem(),
    };
}

async function startServer() {
    try {
        const systemInfo = await getSystemInfo();

        console.log("\nConsole> 🔰 System Information: \n");
        console.log(` * Node Version: ${systemInfo.nodeVersion}`);
        console.log(` * Platform: ${systemInfo.platform}`);
        console.log(` * Architecture: ${systemInfo.architecture}`);
        console.log(` * CPU Cores: ${systemInfo.cpus}`);
        console.log(` * Total Memory: ${(systemInfo.memory / 1024 ** 3).toFixed(2)} GB`);
        console.log(` * Free Memory: ${(systemInfo.freeMemory / 1024 ** 3).toFixed(2)} GB\n`);

        await sequelize.sync();

        console.log(`\nConsole> 🔰 Database running\n`);

        redisClient.connect();

        app.listen({ host: env.FASTIFY_HOST, port: Number(env.FASTIFY_PORT) }, (err, address) => {
            if (err) {
                console.error("\nConsole> ❌ Error starting server:", err);
                process.exit(1);
            } else {
                console.log(`\nConsole> 🔰 Server running: ${address}`);
                app.swagger();
                console.log(`Console> 🔰 Swagger running: ${address + "/docs"} \n`);
            }
        });
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

startServer();
