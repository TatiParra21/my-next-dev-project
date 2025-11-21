
import 'dotenv/config';

// =================================================
// 🔹 Step 2: Handle deep link callback (from backend)
// =================================================
export async function handleAuthCallback(deepLinkUrl: string) {
  try {
    const url = new URL(deepLinkUrl);
    const token = url.searchParams.get("token");
    if (!token) {
      throw new Error("No token found in redirect URL.");
    }
    console.log("✅ Received ID token:", token);
    return { token };
  } catch (err) {
    console.error("❌ Failed to handle deep link:", err);
    throw err;
  }
}