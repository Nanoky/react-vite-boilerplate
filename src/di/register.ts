import { GetUser } from '../features/users/application/get-user.usecase';
import { FakeUserRepository } from '../features/users/infrastructure/fake-user.repository';
import { container } from './container';
import { TOKENS } from './tokens';

container.register(TOKENS.UserRepository, () => new FakeUserRepository());
container.register(TOKENS.GetUser, () => new GetUser(container.resolve(TOKENS.UserRepository)));