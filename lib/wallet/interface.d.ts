export interface WalletResponse {
  data: {
    id: string;
    currency: number;
    created_at: string;
    updated_at: string;
  };
}

export interface TopupPayload{
    currency: number
}