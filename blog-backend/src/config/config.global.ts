import { ConfigService } from 'services/config.service';
import { ENV_PROD_DIRECTORY } from 'config/config.constants';
import { ConfigOptions } from './config.options';

export const GLOBAL_CONFIG_SERVICE =  new ConfigService(new ConfigOptions(ENV_PROD_DIRECTORY));
