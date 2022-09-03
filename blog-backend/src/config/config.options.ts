import {IConfigOptions } from 'config/interfaces/config-options.interface';

export class ConfigOptions extends IConfigOptions {

    constructor(private readonly envfolder: string, private readonly envfileName: string = '.env') {
        super();
    }

    folder(): string {
        return this.envfolder;
    }

    fileName(): string {
        return this.envfileName;
    }
}
