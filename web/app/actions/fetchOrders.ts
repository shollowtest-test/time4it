"use server";

import axios from "axios";
import { IFetchResult, IOrder } from "../types/IOrder";
import { getTenantIdFromCookie } from "@/lib/getTenantIdFromCookie";

export async function fetchOrders(
  page: number = 1,
  limit: number = 10
): Promise<IFetchResult> {
  const tenantId = await getTenantIdFromCookie();

  console.log("Server Action uruchomiona!");

  try {
    const params: { page: number; limit: number } = { page, limit };

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/orders?tenantId=${tenantId}`,
      { params }
    );

    console.log(response.data);

    // Używamy innych nazw, żeby uniknąć konfliktu
    const { items, total, limit: resLimit, page: resPage } = response.data;
    return { items, total, limit: resLimit, page: resPage };
  } catch (error) {
    console.error("Błąd podczas pobierania zamówień:", error);
    throw new Error("Nie udało się pobrać zamówień");
  }
}
