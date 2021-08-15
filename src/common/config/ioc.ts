import 'module-alias/register';
import { Container } from 'inversify';
import { IOC_TYPES } from './ioc-types';

// import controllers
import '../../server/controllers';

// import repos
import { UserRepository, IUserRepository } from '@app/data/user';

// import services
import { INipService, NipService } from '@app/server/services/nip';

const container = new Container();

container.bind<INipService>(IOC_TYPES.NipService).to(NipService);

container
  .bind<IUserRepository>(IOC_TYPES.AccountRepository)
  .to(UserRepository);

export default container;
