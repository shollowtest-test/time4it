export interface IOrder {
  orderId: string;
  tenantId: string;
  buyerEmail: string;
  status: string;
  total: number;
  createdAt: string;
  attachment?: any; //TODO
}

export interface IFetchResult {
  items: IOrder[];
  page?: number;
  limit?: number;
  total?: number;
}
