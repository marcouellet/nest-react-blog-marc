export interface IConfig {
    dataServerName: string;
    connectionString: string;
    authStrategyName: string;
    authSecretKey: string;
    authExpiresIn: string;
    authRefreshTokenSecretKey: string;
    authRefreshTokenExpiresIn: string;
    loggerLevels: string[];
}

export class IConfigService {
    getConfig(): IConfig { return null; }
}
