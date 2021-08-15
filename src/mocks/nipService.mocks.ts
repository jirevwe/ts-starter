import { NipService } from '@app/server/services/nip';
import {
  NameEnquiryDTO,
  NIPTransferOptions
} from '@app/server/services/nip/nip.typings';

/**
 * Mock instance of the NipService.
 * Alternatively `nock` should be used to mock inter-service communication
 */
const NipServiceMock = new NipService();

NipServiceMock.getBanks = async () => {
  return Promise.resolve([
    {
      name: 'EcoBank',
      code: '123'
    },
    {
      name: 'Jaiz',
      code: '121'
    }
  ]);
};

NipServiceMock.nameEnquiry = async (options: NameEnquiryDTO) => {
  return Promise.resolve({
    response_code: '00',
    account_name: 'RAYMOND TUKPE',
    session_id: '000000',
    kyc_level: 1,
    bvn: '12345678901'
  });
};

NipServiceMock.bankTransfer = async (options: NIPTransferOptions) => {
  return Promise.resolve({
    verify: '99',
    response_code: '00',
    transaction_id: 'qwertyuiop'
  });
};

export default NipServiceMock;
