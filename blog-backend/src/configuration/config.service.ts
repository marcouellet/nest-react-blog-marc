import { Injectable } from '@nestjs/common';
import { IConfigModuleOptions} from './config.module.options'

@Injectable()
export class ConfigService {
    constructor(private options: IConfigModuleOptions) {
    }

    getOptions() : IConfigModuleOptions {
        return this.options;
    }
}
