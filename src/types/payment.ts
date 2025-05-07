export type PaymentResponse = {
  payment: YodlPayment;
};

export type YodlPayment = {
  chainId: number;
  txHash: string;
  paymentIndex: number;
  blockTimestamp: string;

  tokenOutSymbol: string;
  tokenOutAddress: string;
  tokenOutAmountGross: string;

  receiverAddress: string;
  receiverEnsPrimaryName: string;
  receiverYodlConfig: any;

  invoiceCurrency: string;
  invoiceAmount: string;

  senderAddress: string;
  senderEnsPrimaryName: string;
  memo: string;
};
