import { ENV_TEST_DIRECTORY, ENV_TEST_CONFIG_FILE_OK, ENV_TEST_CONFIG_FILE_WITH_WRONG_DATA } from './config.constants';
import { ConfigOptions } from '../../src/config/config.options';
import { ConfigService } from '../../src/services/config.service';

export const GLOBAL_TEST_CONFIG_SERVICE =  new ConfigService(new ConfigOptions(ENV_TEST_DIRECTORY, ENV_TEST_CONFIG_FILE_OK));
export const GLOBAL_TEST_CONFIG_SERVICE_WITH_WRONG_OPTIONS =  new ConfigService(
        new ConfigOptions(ENV_TEST_DIRECTORY, ENV_TEST_CONFIG_FILE_WITH_WRONG_DATA));
