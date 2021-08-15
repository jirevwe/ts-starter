import { NipService } from '@app/server/services/nip';
import {
  NameEnquiryDTO,
  NIPTransferOptions
} from '@app/server/services/nip/nip.typings';

const NipServiceMock = new NipService();
NipServiceMock.getBanks = async () => {
  return Promise.resolve([]);
};

NipServiceMock.nameEnquiry = async (options: NameEnquiryDTO) => {
  return Promise.resolve({});
};

NipServiceMock.bankTransfer = async (options: NIPTransferOptions) => {
  return Promise.resolve({});
};

export default NipServiceMock;
