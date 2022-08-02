export interface IConfig {
    dataServerName: string;
    connectionString: string;
    authStrategyName: string;
    authSecretKey: string;
    authExpiresIn: string; //seconds
    authRefreshTokenSecretKey: string;
    authRefreshTokenExpiresIn: string; //seconds
    loggerLevels: string[];
    serverPort: string;
}

export class IConfigService {
    getConfig(): IConfig { return null; }
}
