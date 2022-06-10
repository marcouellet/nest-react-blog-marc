export interface IConfig {
    dataServerName: string;
    connectionString: string;
    authStrategyName: string;
    authSecretKey: string;
    authExpiresIn: string;
    authRefreshTokenSecretKey: string;
    authRefreshTokenExpiresIn: string;
}

export class IConfigService {
    getConfig(): IConfig { return null; }
}
