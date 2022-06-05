import { ENV_PROD_DIRECTORY } from '../config/config.constants';
import { ConfigOptions } from './config.options';
import { ConfigService } from '../services/config.service';

export const GLOBAL_CONFIG_SERVICE =  new ConfigService(new ConfigOptions(ENV_PROD_DIRECTORY));
