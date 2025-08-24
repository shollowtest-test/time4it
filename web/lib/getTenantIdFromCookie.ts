import { cookies } from "next/headers";

export async function getTenantIdFromCookie(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  //TODO: Dodac logikę w zależności od środowiksa (To jest myk na brak Ciastka)
  const authData = token ? JSON.parse(token) : { tenantId: "t-123" };
  return authData.tenantId;
}
