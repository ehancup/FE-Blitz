interface Etalase {
  id: string;
  name: string;
  avatar: string;
  store_id: string;
}

export interface EtalaseResponse {
  data: Etalase[];
}

export interface CreateEtalasePayload {
  name: string;
  avatar?: string;
}
