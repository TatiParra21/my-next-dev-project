import { useEffect } from "react";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebaseClient";

export function DeepLinkListener() {
  useEffect(() => {
    window.electron.ipcRenderer.on("auth-token-url", (url) => {
      console.log("🪄 Deep link received:", url);
      const token = new URL(url).searchParams.get("token");
      console.log("🪪 Token received:", token);

      if (token) {
        signInWithCustomToken(auth, token)
          .then(() => console.log("✅ User signed in successfully"))
          .catch((err) => console.error("❌ Sign-in error:", err));
      }
    });
  }, []);

  return null;
}
