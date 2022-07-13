export const LOCAL_AUTH_STRATEGY_NAME = 'LOCAL';
export const JWT_AUTH_STRATEGY_NAME = 'JWT';
export const MONGO_SERVER_NAME = 'MONGODB';
export const VALID_AUTH_STRATEGY_NAMES: string[] =  [LOCAL_AUTH_STRATEGY_NAME, JWT_AUTH_STRATEGY_NAME];
export const VALID_DATA_SERVER_NAMES: string[] =  [MONGO_SERVER_NAME];
export const ENV_PROD_DIRECTORY = './';
export const ENV_TEST_DIRECTORY = 'test/environment';
export const ENV_TEST_CONFIG_FILE_OK = 'ok.env';
export const ENV_TEST_CONFIG_FILE_WITH_WRONG_DATA = 'unknown_data_server_name.env';