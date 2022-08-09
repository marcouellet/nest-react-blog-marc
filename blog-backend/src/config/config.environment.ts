import { ENVIRONMENT_VARIABLES_PREFIX } from '../config/config.constants';

class Environment {

    static DataServerName: string = ENVIRONMENT_VARIABLES_PREFIX + 'DATA_SERVER_NAME';
    static DataServerConnectionString: string = ENVIRONMENT_VARIABLES_PREFIX + 'DATA_SERVER_CONNECTION_STRING';
    static DataServerUserName: string = ENVIRONMENT_VARIABLES_PREFIX + 'DATA_SERVER_USER_NAME';
    static DataServerUserPassword: string = ENVIRONMENT_VARIABLES_PREFIX + 'DATA_SERVER_USER_PASSWORD';
    static AuthStrategyName: string = ENVIRONMENT_VARIABLES_PREFIX + 'AUTH_STRATEGY_NAME';
    static AuthSecretKey: string = ENVIRONMENT_VARIABLES_PREFIX + 'AUTH_SECRET_KEY';
    static AuthExpiresIn: string = ENVIRONMENT_VARIABLES_PREFIX + 'AUTH_EXPIRES_IN';
    static AuthRefreshTokenSecretKey: string = ENVIRONMENT_VARIABLES_PREFIX + 'AUTH_REFRESH_TOKEN_SECRET_KEY';
    static AuthRefreshTokenExpiresIn: string = ENVIRONMENT_VARIABLES_PREFIX + 'AUTH_REFRESH_TOKEN_EXPIRES_IN';
    static LoggerLevels: string = ENVIRONMENT_VARIABLES_PREFIX + 'LOGGER_LEVELS';
    static ServerPort: string = ENVIRONMENT_VARIABLES_PREFIX + 'SERVER_PORT';
}

export default Environment;