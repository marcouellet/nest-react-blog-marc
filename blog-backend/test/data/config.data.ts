import { IConfigOptions } from 'config/interfaces/config-options.interface';
import { ConfigOptions } from 'config/config.options';
import { ENV_TEST_DIRECTORY } from '../config/config.constants';

export const testOkConfigOptions: IConfigOptions = new ConfigOptions(ENV_TEST_DIRECTORY, 'ok.env');
export const testUnknownDataServerNameConfigOptions: IConfigOptions = new ConfigOptions(ENV_TEST_DIRECTORY, 'unknown_data_server_name.env');
export const testUnknownAuthStrategyNameConfigOptions: IConfigOptions = new ConfigOptions(ENV_TEST_DIRECTORY, 'unknown_auth_strategy_name.env');
