import { v4 as uuidv4 } from 'uuid';

export interface RequestOpts {
  serialNumber: string;
  activation: string;
  amount: number;
  transactionStatus: string;
}

export interface TotalAmount {
  currency: string;
  value: string;
}

export interface PayloadJSON {
  transactionStatus: string;
  paymentTransactionReferenceNumber: string;
  requestReferenceNumber: string;
  activationCode: string;
  deviceSerialNumber: string;
  dateCreated: string;
  totalAmount: TotalAmount;
}

export interface ErrorResponse {
  message: string;
}

export interface SuccessResponse {
  transactionStatus: string;
  requestReferenceNumber: string;
}

export type Response = SuccessResponse | { error: ErrorResponse };

export async function makeRequest(
    opts: RequestOpts,
    secretKey: string
): Promise<Response> {
  const authHeader = `Bearer ${secretKey}`;
  const endpoint = "https://qrph.xpay.world/transact";

  const payload: PayloadJSON = {
    transactionStatus: opts.transactionStatus,
    paymentTransactionReferenceNumber: uuidv4(),
    requestReferenceNumber: uuidv4(),
    activationCode: opts.activation,
    deviceSerialNumber: opts.serialNumber,
    dateCreated: new Date().toISOString(),
    totalAmount: {
      currency: "PHP",
      value: opts.amount.toFixed(2),
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Response = await response.json();

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error: ${error.message}`);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
}