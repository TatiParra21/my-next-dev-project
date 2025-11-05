import { shell } from "electron";
import { OAuth2Client } from "google-auth-library";
import 'dotenv/config';
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
console.log(CLIENT_ID, "client")
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = "https://my-next-dev-project.onrender.com/auth/google/callback"; // your custom protocol
const SCOPES = ["openid", "profile", "email"];

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
//console.log(oAuth2Client)
/**
 * Step 1: Start login
 * Opens system browser to Google's login page.
 */export async function startGoogleLogin() {
  // Instead of calling Google directly,
  // we open your hosted backend which handles the flow
  const backendAuthUrl = "https://my-next-dev-project.onrender.com/auth/google";

  console.log("🌐 Opening browser for login:", backendAuthUrl);
  shell.openExternal(backendAuthUrl);
}

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