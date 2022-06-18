import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { LogLevel, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { IConfig, IConfigService } from '../config/interfaces/config.interface';
import { EnvConfig } from '../config/interfaces/envconfig.interface';
import { IConfigOptions } from '../config/interfaces/config-options.interface';
import { CustomLogger } from '../common/custom.logger';
import { VALID_AUTH_STRATEGY_NAMES, VALID_DATA_SERVER_NAMES, VALID_LOGGER_LEVELS } from '../config/config.constants';

@Injectable()
export class ConfigService implements IConfigService {
    private readonly envConfig: EnvConfig;
    private config: IConfig;
    private loggerLevels: string[];

    constructor(options: IConfigOptions) {
        const envFile = path.resolve(__dirname, '../../', options.folder(), options.fileName());
        this.envConfig = dotenv.parse(fs.readFileSync(envFile));
    }

    getConfig(): IConfig {
        if (!this.config) {
            this.config = this.initConfig();
        }

        return this.config;
    }

    private getEnvConfig(key: string): string {
        return this.envConfig[key];
    }

    private validateAuthStrategyName(authStrategyName: string): boolean {
        return VALID_AUTH_STRATEGY_NAMES.includes(authStrategyName);
    }

    private validateDataServerName(dataServerName: string): boolean  {
    return VALID_DATA_SERVER_NAMES.includes(dataServerName);
    }

    private validateLoggerLevels(loggerLevels: string): boolean  {
        this.loggerLevels = loggerLevels.split('|');
        return this.loggerLevels.every( level => VALID_LOGGER_LEVELS.includes(level.trim()));
    }

    private initConfig(): IConfig {

        const dataServerName = this.getEnvConfig('DATA_SERVER_NAME');
        const connectionString =  this.getEnvConfig('DATA_SERVER_CONNECTION_STRING');
        const authStrategyName = this.getEnvConfig('AUTH_STRATEGY_NAME');
        const authSecretKey = this.getEnvConfig('AUTH_SECRET_KEY');
        const authExpiresIn = this.getEnvConfig('AUTH_EXPIRES_IN');
        const authRefreshTokenSecretKey = this.getEnvConfig('AUTH_REFRESH_TOKEN_SECRET_KEY');
        const authRefreshTokenExpiresIn = this.getEnvConfig('AUTH_REFRESH_TOKEN_EXPIRES_IN');
        const loggerLevelsString = this.getEnvConfig('LOGGER_LEVELS');

        if (!dataServerName) {
            throw new NotFoundException('Please, provide a value for DATA_SERVER_NAME in env file');
        }

        if (!connectionString) {
            throw new NotFoundException('Please, provide a value for DATA_SERVER_CONNECTION_STRING in env file');
        }

        if (!authStrategyName) {
            throw new NotFoundException('Please, provide a value for AUTH_STRATEGY_NAME in env file');
        }

        if (!authSecretKey) {
            throw new NotFoundException('Please, provide a value for AUTH_SECRET_KEY in env file');
        }

        if (!authExpiresIn) {
            throw new NotFoundException('Please, provide a value for AUTH_EXPIRES_IN in env file');
        }

        if (!authRefreshTokenSecretKey) {
            throw new NotFoundException('Please, provide a value for AUTH_REFRESH_TOKEN_SECRET_KEY in env file');
        }

        if (!authRefreshTokenExpiresIn) {
            throw new NotFoundException('Please, provide a value for AUTH_REFRESH_TOKEN_EXPIRES_IN in env file');
        }

        if (!loggerLevelsString) {
            throw new NotFoundException('Please, provide a value for LOGGER_LEVELS in env file');
        }

        if (!this.validateAuthStrategyName(authStrategyName)) {
            throw new NotFoundException('Invalid auth strategy name : ' + authStrategyName +
            ', should belong to ' +  VALID_AUTH_STRATEGY_NAMES.toString());
        }

        if (!this.validateDataServerName(dataServerName)) {
            throw new NotFoundException('Invalid data server name : ' + dataServerName +
            ', should belong to ' +  VALID_DATA_SERVER_NAMES.toString());
        }

        if (!this.validateLoggerLevels(loggerLevelsString)) {
            throw new NotFoundException('Invalid logger level value(s), should belong to ' + VALID_LOGGER_LEVELS.toString());
        }

        CustomLogger.overrideLogger(this.loggerLevels as LogLevel[]);

        return { dataServerName, connectionString, authStrategyName,
                authSecretKey, authExpiresIn, authRefreshTokenSecretKey, authRefreshTokenExpiresIn, loggerLevels: this.loggerLevels };
    }
}
