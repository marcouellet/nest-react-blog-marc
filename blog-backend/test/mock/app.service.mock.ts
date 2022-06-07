import { AppService } from '../../src/services/app.service';
import { testServerInfo } from '../data/app.data';

const AppServiceMock = {
    provide: AppService,
    useValue: {
      getServerInfo: jest.fn().mockImplementation(() => testServerInfo),
     },
};

export default AppServiceMock;
