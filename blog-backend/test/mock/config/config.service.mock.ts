import { Injectable } from '@nestjs/common';
import { IConfig, GetConfigMock } from './config.mock';

@Injectable()
export class ConfigServiceMock {
    private config: IConfig;

    constructor() {
        this.config = GetConfigMock();
    }

    getConfig(): IConfig {
        return this.config;
    }
}
