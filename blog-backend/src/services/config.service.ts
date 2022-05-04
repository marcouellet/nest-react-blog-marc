import { Injectable } from '@nestjs/common';
import { IConfig, GetConfig } from '../config/config';
@Injectable()
export class ConfigService {
    private config: IConfig;

    constructor() {
        this.config = GetConfig();
    }

    getConfig(): IConfig {
        return this.config;
    }
}
