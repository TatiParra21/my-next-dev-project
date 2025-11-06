import keytar from "keytar";

const SERVICE_NAME = "MyNextDevProject"; // anything unique to your app

export async function saveToken(token: string) {
  await keytar.setPassword(SERVICE_NAME, "google_token", token);
  console.log("🔐 Token saved securely in OS keychain.");
}

export async function getToken(): Promise<string | null> {
  const token = await keytar.getPassword(SERVICE_NAME, "google_token");
  console.log("📦 Retrieved token:", !!token);
  return token;
}

export async function clearToken() {
  await keytar.deletePassword(SERVICE_NAME, "google_token");
  console.log("🧹 Token deleted from keychain.");
}
