import { Injectable } from '@nestjs/common';
import { IConfigOptions, GetConfigOptions } from './config.options'

@Injectable()
export class ConfigService {
    private configOptions : IConfigOptions;

    constructor() {
        this.configOptions = GetConfigOptions();
    }
    
    getOptions() : IConfigOptions {
        return this.configOptions;
    }
}
