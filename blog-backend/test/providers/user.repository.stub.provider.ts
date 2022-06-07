import { User } from '../../src/frameworks/data/mongo/model/user.model';
import { UserRepositoryStub } from '../stubs/user.repository.stub';

const UserRepositoryStubProvider = {
    provide: User.name,
    useClass: UserRepositoryStub,
};

export default UserRepositoryStubProvider;
