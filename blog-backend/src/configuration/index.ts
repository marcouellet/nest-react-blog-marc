import { IConfigModuleOptions, DataServerName } from './config.module'

export * from "./config.service"
export * from "./config.module"

export const CONFIG_MODULE_OPTIONS : IConfigModuleOptions = {
    dataServerName: DataServerName.MONGO,
    connectionString: process.env.MONGO_CONNECTION_STRING
}  





