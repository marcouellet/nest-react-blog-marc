import { ENV_TEST_E2E_DIRECTORY, ENV_TEST_E2E_CONFIG_FILE } from './config.constants';
import { ConfigOptions } from 'config/config.options';
import { ConfigService } from 'services/config.service';

export const GLOBAL_TEST_E2E_CONFIG_SERVICE =  new ConfigService(new ConfigOptions(ENV_TEST_E2E_DIRECTORY, ENV_TEST_E2E_CONFIG_FILE));

