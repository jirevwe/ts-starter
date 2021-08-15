import { Request } from 'express';

export interface GenericRequest {
  /**
   * Id of the user involved in the request
   */
  user: any;

  /**
   * Unique request id
   */
  id: string;
}

/**
 * Typings for the response body gotten from the NIP service when a name enquiry call is made
 */
export interface NameEnquiryResponse {
  response_code: string;
  account_name: string;
  session_id: string;
  kyc_level: string;
  bvn: string;
}

export interface BankTransferDTO {
  amount: number;
  destination_bank_code: string;
  account_number: string;
  channel_code: string;
  narration: string;
}

export interface NameEnquiryDTO {
  destination_bank_code: string;
  account_number: string;
  channel_code: string;
}

export interface NIPTransferOptions {
  /**
   * Generic request object - used for assigning a unique request id
   * to requests in order to trace how a requests flows across services
   */
  req: Request;

  /**
   * Response gotten from the name enquiry call
   */
  nameEnquiryResponse: NameEnquiryResponse;

  /**
   * Request body originally used to create the deferred bank transfer
   * This should be stored on the deferred bank transfer and gotten from there
   */
  body: BankTransferDTO;
}

/**
 * Typings for the response body gotten from the NIP service when a bank transfer
 * is successfully carried out
 */
export interface NIPTransferResponse {
  /**
   * Response code gotten when the transfer is requeried
   */
  verify: string;

  /**
   * Response code for the transfer
   */
  response_code: string;

  /**
   * Transaction ID for the transfer
   */
  transaction_id: string;
}
