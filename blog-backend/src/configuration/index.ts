import { DataServerName } from "./dataServerConfig"
import { MongoDataServerConfig } from "./mongoDataServerConfig"

export * from "./dataServerConfig"
export * from "./mongoDataServerConfig"

export const DATA_BASE_SERVER_NAME = DataServerName.MONGO;

export const MONGO_DATA_BASE_SERVER_CONFIGURATION = new MongoDataServerConfig(process.env
      .MONGO_CONNECTION_STRING as string,);

