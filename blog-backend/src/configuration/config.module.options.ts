import { DataServerName } from './config.data.service'

export abstract class IConfigModuleOptions {
    dataServerName: DataServerName;
    connectionString: string;
  }


 