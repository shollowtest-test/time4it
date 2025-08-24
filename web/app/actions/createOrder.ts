"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { generateRandomItems } from "../utils/itemRandomGenerator";
import { FormState } from "../types/IFormState";
import { IError } from "../types/IError";

export async function createOrder(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const file = formData.get("file") as File;

  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) return { success: false, message: "Brak autoryzacji." };
  const { tenantId, user } = JSON.parse(token);

  if (!file || file.size === 0)
    return { success: false, message: "Plik jest wymagany." };

  try {
    const backendApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendApiUrl) throw new Error("Brak konfiguracji API_URL");

    //Presign
    const presignRes = await fetch(`${backendApiUrl}/uploads/presign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tenantId,
        size: file.size,
        filename: file.name,
        contentType: file.type,
      }),
    });
    if (!presignRes.ok)
      throw new Error(`Błąd presign: ${await presignRes.text()}`);
    const { url, storageKey } = await presignRes.json();

    //Własciwy Ipload
    const uploadRes = await fetch(url, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!uploadRes.ok) throw new Error("Błąd podczas wysyłania pliku.");

    // Mockupowane dane wejsciowe.
    const orderPayload = {
      requestId: `req-${uuidv4()}`,
      tenantId,
      buyer: { email: user.email, name: "Alice Faked" },
      items: generateRandomItems(),
      attachment: {
        filename: file.name,
        contentType: file.type,
        size: file.size,
        storageKey,
      },
    };

    const createOrderRes = await fetch(`${backendApiUrl}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    // console.log("po otrzymaniu zamówienia", createOrderRes);
    if (!createOrderRes.ok) {
      if (createOrderRes.status === 409)
        return {
          success: false,
          message: "To żądanie zostało już przetworzone.",
        };
      throw new Error("Nie udało się utworzyć zamówienia.");
    }

    // console.log("revitalizacja cache");
    revalidatePath("/orders");
    return {
      success: true,
      message: "Zamówienie pomyślnie utworzone!",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Wystąpił nieoczekiwany błąd.",
    };
  }
}
