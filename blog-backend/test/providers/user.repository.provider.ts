import { User } from '../../src/frameworks/data/mongo/model/user.model';
import { UserRepositoriesMock } from '../mock/data/mongo/model/user.repository.mock';

const UserRepositoryProvider = {
    provide: User.name,
    useClass: UserRepositoriesMock,
};

export default UserRepositoryProvider;
