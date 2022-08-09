import * as path from 'path';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { LogLevel, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import Environment from '../config/config.environment';
import { IConfig, IConfigService } from '../config/interfaces/config.interface';
import { EnvConfig } from '../config/interfaces/env.config.interface';
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
        return process.env[key] || this.envConfig[key];
    }

    private validateAuthStrategyName(authStrategyName: string): boolean {
        return VALID_AUTH_STRATEGY_NAMES.includes(authStrategyName);
    }

    private validateDataServerName(dataServerName: string): boolean  {
    return VALID_DATA_SERVER_NAMES.includes(dataServerName);
    }

    private validateLoggerLevels(loggerLevels: string): boolean  {
        this.loggerLevels = loggerLevels.split('|').map(level => level.trim());
        return this.loggerLevels.every( level => VALID_LOGGER_LEVELS.includes(level));
    }

    private envVarNotFound(envvar: string) {
        throw new NotFoundException(`Please, provide a value for ${envvar} in env file`);
    }

    private initConfig(): IConfig {

        const dataServerName = this.getEnvConfig(Environment.DataServerName);
        const connectionString =  this.getEnvConfig(Environment.DataServerConnectionString);
        const dataServerUserName = this.getEnvConfig(Environment.DataServerUserName);
        const dataServerUserPassword = this.getEnvConfig(Environment.DataServerUserPassword);
        const authStrategyName = this.getEnvConfig(Environment.AuthStrategyName);
        const authSecretKey = this.getEnvConfig(Environment.AuthSecretKey);
        const authExpiresIn = this.getEnvConfig(Environment.AuthExpiresIn);
        const authRefreshTokenSecretKey = this.getEnvConfig(Environment.AuthRefreshTokenSecretKey);
        const authRefreshTokenExpiresIn = this.getEnvConfig(Environment.AuthRefreshTokenExpiresIn);
        const loggerLevelsString = this.getEnvConfig(Environment.LoggerLevels);
        const serverPort = this.getEnvConfig(Environment.ServerPort);

        if (!dataServerName) {
            this.envVarNotFound(Environment.DataServerName);
        }

        if (!connectionString) {
            this.envVarNotFound(Environment.DataServerConnectionString);
        }

        if (!authStrategyName) {
            this.envVarNotFound(Environment.AuthStrategyName);
        }

        if (!authSecretKey) {
            this.envVarNotFound(Environment.AuthSecretKey);
        }

        if (!authExpiresIn) {
            this.envVarNotFound(Environment.AuthExpiresIn);
        }

        if (!authRefreshTokenSecretKey) {
            this.envVarNotFound(Environment.AuthRefreshTokenSecretKey);
        }

        if (!authRefreshTokenExpiresIn) {
            this.envVarNotFound(Environment.AuthRefreshTokenExpiresIn);
        }

        if (!loggerLevelsString) {
            this.envVarNotFound(Environment.LoggerLevels);
        }

        if (!serverPort) {
            this.envVarNotFound(Environment.ServerPort);
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

        return { dataServerName, connectionString, authStrategyName, dataServerUserName, dataServerUserPassword,
                authSecretKey, authExpiresIn, authRefreshTokenSecretKey, authRefreshTokenExpiresIn,
                loggerLevels: this.loggerLevels, serverPort };
    }
}
