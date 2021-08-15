import 'reflect-metadata';
import 'module-alias/register';

import container from '../common/config/ioc';
import { IOC_TYPES } from '../common/config/ioc-types';
import NipServiceMock from '../mocks/nipService.mocks';
import { INipService } from '../server/services/nip';

beforeEach(() => {
  // create a snapshot so each unit test can modify
  // it without breaking other unit tests
  container.snapshot();
});

afterEach(() => {
  // Restore to last snapshot so each unit test
  // takes a clean copy of the application container
  container.restore();
});

describe('test mock', () => {
  it('should use the mock', async () => {
    container.unbind(IOC_TYPES.NipService);
    container
      .bind<INipService>(IOC_TYPES.NipService)
      .toConstantValue(NipServiceMock);

    const nipService = container.get<INipService>(IOC_TYPES.NipService);
    const banks = await nipService.getBanks();
    expect(banks.length).toBe(2);
    expect(banks[0].name).toMatch('EcoBank');
  });

  // skipped because it tries to initiate an API call; TODO improve this test
  it.skip('should not use the mock', async () => {
    const nipService = container.get<INipService>(IOC_TYPES.NipService);
    expect(await nipService.nameEnquiry(null)).toBe('');
  });
});
