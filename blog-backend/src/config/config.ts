import * as dotenv from 'dotenv';
import { NotFoundException } from '@nestjs/common';

export const MONGO_SERVER_NAME = 'MONGODB';

const result = dotenv.config();

if (result?.error) {
    throw new Error('Add .env file');
}

const validDataServerNames: string[] =  [MONGO_SERVER_NAME];

const validateDataServerName = (dataServerName: string): boolean => {
    return validDataServerNames.includes(dataServerName);
};
export interface IConfig {
    dataServerName: string;
    connectionString: string;
}

export const GetConfig = (): IConfig => {

    const dataServerName = process.env.DATA_SERVER_NAME;
    const connectionString =  process.env.DATA_SERVER_CONNECTION_STRING;

    if (!dataServerName) {
        throw new NotFoundException('Please, provide a value for DATA_SERVER_NAME in env file'); 
    }

    if (!connectionString) {
        throw new NotFoundException('Please, provide a value for DATA_SERVER_CONNECTION_STRING in env file'); 
    }

    if (!validateDataServerName(dataServerName)) {
        throw new NotFoundException('Invalid data server name : ' + dataServerName +
        ', should belong to ' +  validDataServerNames.toString());
    }

    return { dataServerName, connectionString };
};
