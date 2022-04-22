import { IConfigModuleOptions} from './config.module.options'
import { DataServerName } from './config.data.service'

export const CONFIG_MODULE_OPTIONS : IConfigModuleOptions = {
    dataServerName: DataServerName.MONGO,
    connectionString: process.env.MONGO_CONNECTION_STRING
}  
