import { app, BrowserWindow, safeStorage, } from 'electron';
import { Conf } from "electron-conf";
import path from 'node:path';

import { ipcMain, } from "electron";
import axios from "axios";

///declare const MAIN_WINDOW_VITE_DEV_SERVER_URL: string | undefined
//declare const MAIN_WINDOW_VITE_NAME: string

const store = new Conf<Record<string, string>>({
  name: "secure-tokens",

});

export interface GoogleAuthResult {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  token_type?: string;
}
const setSecureToken=(key:string, value:string):void =>{
  if (safeStorage.isEncryptionAvailable()) {
    const buffer = safeStorage.encryptString(value);
    // Store the buffer as a latin1 string in the JSON file
    store.set(key, buffer.toString('latin1'));
  } else {
    // Handle the case where encryption is unavailable
    console.log("encryption not available");
  }
}
function getSecureToken (key: string): string | null {
  const encryptedValue = store.get(key);
   if (!encryptedValue) return null;
  return safeStorage.decryptString(
    Buffer.from(encryptedValue, "latin1")
  );
}
const deleteSecureToken =(key:string):void=>{
  store.delete(key)
}
async function refreshAccessToken():Promise<string| null> {
  const refreshToken = getSecureToken("google-refresh-token");
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await axios.get("http://localhost:4000/refresh-token", {
    params: { refresh_token: refreshToken },
  });

  const newAccessToken = res.data.access_token;
  // Save the new access token
  setSecureToken("google-access-token", newAccessToken);
  return newAccessToken;
}

async function getAccessToken(): Promise<string | null> {
  return getSecureToken("google-access-token")
}
const PROTOCOL_PREFIX = 'myelectronproject';
// Handle creating/removing shortcuts on Windows when installing/uninstalling.

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient(
      PROTOCOL_PREFIX,
      process.execPath,
      [path.resolve(process.argv[1])]
    );
  }
} else {
  app.setAsDefaultProtocolClient(PROTOCOL_PREFIX);
}

const createWindow = ():void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "../preload/index.mjs"),
       sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // and load the index.html of the app.
const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  mainWindow.loadURL("http://localhost:5173");
} else {
  mainWindow.loadFile(
    path.join(__dirname, "../renderer/index.html")
  );
}

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

ipcMain.handle(
  "google-login",
  async (_event, { codeVerifier, codeChallenge }: {
      codeVerifier: string;
      codeChallenge: string;
    }):Promise<GoogleAuthResult> => {
    try {
      // 1. Get OAuth URL from backend
      const res = await axios.get("http://localhost:4000/auth/google", {
        params: { code_challenge: codeChallenge },
      });
      const authUrl = res.data.authUrl;

      // 2. Open visible BrowserWindow to handle login
      const loginWindow = new BrowserWindow({
        width: 500,
        height: 700,
        show: true,
        webPreferences: { nodeIntegration: false },
      });

      return await new Promise<GoogleAuthResult>((resolve, reject) => {
        loginWindow.webContents.on("did-navigate", async (_event, newUrl) => {
          const parsedUrl = new URL(newUrl);

          // 3. Check if Google redirected to our backend callback
          if (
            parsedUrl.origin === "http://localhost:4000" &&
            parsedUrl.pathname === "/oauth2callback"
          ) {
            const code = parsedUrl.searchParams.get("code");
            loginWindow.close();
            if (!code) return reject("No code received");

            try {
              //Exchange code for token via backend
              const tokenRes = await axios.get(
                "http://localhost:4000/oauth2callback",
                {
                  params: { code, code_verifier: codeVerifier },
                }
              );
              // Save tokens in OS keychain
              setSecureToken( "google-access-token",tokenRes.data.access_token)
             setSecureToken( "google-refresh-token",tokenRes.data.refresh_token)
    

              resolve(tokenRes.data);
            } catch (err) {
              reject(err);
            }
          }
        });

        // 5. Load Google login
        loginWindow.loadURL(authUrl);
      });
    } catch (err) {
      console.error(err);
      ///return { access_token: null };
      throw err
    }
  }
);

ipcMain.handle("google-logout", async () => {
  const accessToken = getAccessToken()

  if (accessToken) {
    // Revoke token on Google
    await axios.post(
      `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
      null,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );
  }

  // Delete tokens from Keytar
  deleteSecureToken("google-access-token")
   deleteSecureToken("google-refresh-token")
 

  return true;
});

ipcMain.handle("is-logged-in", async () => {
  const refreshToken = getSecureToken("google-refresh-token")
  return Boolean(refreshToken);
});

ipcMain.handle("get-access-token", async () => {
  let accessToken = await getAccessToken();

  if (!accessToken) {
    accessToken = await refreshAccessToken();
  }

  return accessToken;
});
export interface GoogleUserProfile {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale?: string;
}
ipcMain.handle("fetch-google-profile", async (): Promise<GoogleUserProfile | null> => {
  const accessToken = getAccessToken()
  if (!accessToken) return null;

  try {
    const res = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
});

