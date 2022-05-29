import * as dotenv from 'dotenv';
import { NotFoundException } from '@nestjs/common';

export const LOCAL_AUTH_STRATEGY_NAME = 'LOCAL';
export const JWT_AUTH_STRATEGY_NAME = 'JWT';
export const MONGO_SERVER_NAME = 'MONGODB';

const result = dotenv.config();

if (result?.error) {
    throw new Error('Add .env file');
}

const validateAuthStrategyNames: string[] =  [LOCAL_AUTH_STRATEGY_NAME, JWT_AUTH_STRATEGY_NAME];

const validateAuthStrategyName = (authStrategyName: string): boolean => {
    return validateAuthStrategyNames.includes(authStrategyName);
};

const validDataServerNames: string[] =  [MONGO_SERVER_NAME];

const validateDataServerName = (dataServerName: string): boolean => {
    return validDataServerNames.includes(dataServerName);
};
export interface IConfig {
    dataServerName: string;
    connectionString: string;
    authStrategyName: string;
    authSecretKey: string;
    authExpiresIn: string;
    authRefreshTokenSecretKey: string;
    authRefreshTokenExpiresIn: string;
}

export const GetConfig = (): IConfig => {

    const dataServerName = process.env.DATA_SERVER_NAME;
    const connectionString =  process.env.DATA_SERVER_CONNECTION_STRING;
    const authStrategyName = process.env.AUTH_STRATEGY_NAME;
    const authSecretKey = process.env.AUTH_SECRET_KEY;
    const authExpiresIn = process.env.AUTH_EXPIRES_IN;
    const authRefreshTokenSecretKey = process.env.AUTH_REFRESH_TOKEN_SECRET_KEY;
    const authRefreshTokenExpiresIn = process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN;

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

    if (!validateAuthStrategyName(authStrategyName)) {
        throw new NotFoundException('Invalid auth strategy name : ' + authStrategyName +
        ', should belong to ' +  validateAuthStrategyNames.toString());
    }

    if (!validateDataServerName(dataServerName)) {
        throw new NotFoundException('Invalid data server name : ' + dataServerName +
        ', should belong to ' +  validDataServerNames.toString());
    }

    return { dataServerName, connectionString, authStrategyName,
            authSecretKey, authExpiresIn, authRefreshTokenSecretKey, authRefreshTokenExpiresIn };
};
