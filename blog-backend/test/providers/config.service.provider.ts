import { ConfigService } from '../../src/services/config.service';
import { GetConfigMock } from '../mock/config/config.mock';

const ConfigServiceProvider = {
    provide: ConfigService,
    useValue: {
        getConfig: jest.fn().mockImplementation(() => Promise.resolve(GetConfigMock())),
    },
};

export default ConfigServiceProvider;
