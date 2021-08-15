import axios from 'axios';
import env from '@app/common/config/env';
import { NameEnquiryDTO, NIPTransferOptions } from './nip.typings';
import { injectable } from 'inversify';

export interface INipService {
  getBanks(): Promise<any>;
  bankTransfer(options: NIPTransferOptions): Promise<any>;
  nameEnquiry(options: NameEnquiryDTO): Promise<any>;
}

/**
 * The NIP service handles making REST API calls to some NIP service
 */
@injectable()
export class NipService implements INipService {
  private endpoint: string;

  constructor() {
    this.endpoint = `${env.nip_service_url}${env.nip_service_api_version}`;
  }

  /**
   * Makes a call to some service to get a list of banks and their logos
   * @returns
   */
  async getBanks() {
    const url = `${this.endpoint}/nip/banks`;
    const response = await axios.get(url);
    return response.data.data;
  }

  /**
   * Makes an API call to the NIP service to validate that the
   * provided bank details of a transfer recipient are valid
   * @param options Options for carrying out the Name Enquiry
   */
  async nameEnquiry(options: NameEnquiryDTO) {
    const url = `${this.endpoint}/nip/enquiry`;
    const response = await axios.post(url, options);
    return response.data.data;
  }

  /**
   * Makes an API call to the NIP service to perform an inter bank transfer
   * @param options Options for carrying out the bank transfer
   */
  async bankTransfer(options: NIPTransferOptions) {
    const url = `${this.endpoint}/nip/transfer`;
    const response = await axios.post(url, options);
    return response.data.data;
  }
}

export default new NipService();
