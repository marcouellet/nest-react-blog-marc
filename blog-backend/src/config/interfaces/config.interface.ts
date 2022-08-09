export interface IConfig {
    dataServerName: string;
    dataServerUserName: string;
    dataServerUserPassword: string;
    connectionString: string;
    authStrategyName: string;
    authSecretKey: string;
    authExpiresIn: string; //seconds
    authRefreshTokenSecretKey: string;
    authRefreshTokenExpiresIn: string; //seconds
    loggerLevels: string[]; // ['log', 'error', 'warn', 'debug', 'verbose']
    serverPort: string;
}

export class IConfigService {
    getConfig(): IConfig { return null; }
}
