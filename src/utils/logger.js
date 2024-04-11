import winston, { format } from "winston";
import dayjs from "dayjs";

const newFormat = format.printf(({ level, message, timestamp}) => `${level} ${timestamp} ${JSON.stringify(message)}`)

const timestampTZ = format((info) => ({...info, timestamp: dayjs().format('DD/MM/YYYY-HH:mm:ss')}))

const logger = winston.createLogger({
  format: format.combine(format.colorize(), timestampTZ(), newFormat),
  transports: [
    new winston.transports.Console(),
  ],
});

export default logger;