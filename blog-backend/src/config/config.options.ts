require('dotenv').config({ path: '.env' })

import { NotFoundException } from '@nestjs/common';

export const MONGO_SERVER_NAME = "MONGODB"

const validDataServerNames: String[] =  [MONGO_SERVER_NAME];

const validateDataServerName = (dataServerName) : Boolean => {
    return validDataServerNames.includes(dataServerName);
}

export interface IConfigOptions {
    dataServerName: String;
    connectionString: String;
}

export const GetConfigOptions = () : IConfigOptions => {

    const dataServerName = process.env.DATA_SERVER_NAME;
    const connectionString =  process.env.DATA_SERVER_CONNECTION_STRING;

    if (!dataServerName) {
        throw new NotFoundException("Please, provide a value for DATA_SERVER_NAME in env file"); 
    }

    if (!connectionString) {
        throw new NotFoundException("Please, provide a value for DATA_SERVER_CONNECTION_STRING in env file"); 
    }

    if (!validateDataServerName(dataServerName)) {
        throw new NotFoundException("Invalid data server name : " + dataServerName +
        ", should belong to " +  validDataServerNames.toString());
    }
 
    return { dataServerName:  dataServerName, connectionString: connectionString }
}  






