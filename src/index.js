import app from './app'
import logger from './utils/logger';  

require('dotenv').config();

const PORT = process.env.PORT || 3000;
const hostname = process.env.HOSTNAME || 'localhost'
let server;
const start = async() => {
  try {
    server = app.listen(PORT, () => {
      // Log info server listen
      logger.info(`Server is listening at ${hostname}:${PORT}`)
    });
  } catch (error) {
    logger.error(`${error.name}: ${error.message}`)
  }
}
const exitHandler = () => {
  if (server) {
    server.close(() => {
      // log server closed
      logger.info("Server closed!")
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};


const unexpectedErrorHandler = (error) => {
  // log error
  logger.error(`Unexpected error, server closed!: ${error.name}: ${error.message}`)
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  // log system sigterm
  logger.info('System sigterm, server closed!')
  if (server) {
    server.close();
  }
});
start()