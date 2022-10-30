import './LoadEnv'; // Must be the first import
import app from './Server';
import logger from './shared/Logger';
import { DataSource } from "typeorm";

const AppDataSource = new DataSource({
    "type" : "postgres",
    "host": process.env.TYPEORM_HOST,
    "port": 5432,
    "username": process.env.TYPEORM_USERNAME,
    "password": process.env.TYPEORM_PASSWORD,
    "database": process.env.TYPEORM_DATABASE,
    "ssl": true,
    entities: [
        __dirname + "/entities/**/*.{js,ts}"
    ],
})

AppDataSource.initialize()
    .then(() => {
        logger.info("Data Source has been initialized!")
    })
    .catch((err) => {
      logger.info("Error during Data Source initialization", err)
    })

// const redisPORT = Number(process.env.REDIS_PORT || 6379)
// initializeCache(redisPORT);

// Start the server
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + port);
});

export default AppDataSource;