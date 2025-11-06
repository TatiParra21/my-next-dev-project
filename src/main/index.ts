// =================================================
// 🔹 Imports
// =================================================
import { app,ipcMain, BrowserWindow, shell } from "electron";
import path, { join } from "path";
import { fileURLToPath } from "url";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import log from "electron-log";
import { startGoogleLogin, handleAuthCallback } from "./authFlow.js";
import { saveToken,getToken,clearToken } from "./keytarStore";
// =================================================
// 🔹 Globals
// =================================================
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow: BrowserWindow | null = null;
let deeplinkUrl: string | null = null;
ipcMain.handle("save-token", async (_, token) => saveToken(token));
ipcMain.handle("get-token", async () => getToken());
ipcMain.handle("clear-token", async () => clearToken());
// =================================================
// 🔹 Custom Protocol Registration (Deep Links)
// =================================================
// Allows OS to recognize URLs like mynextdevproject://auth
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("mynextdevproject", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("mynextdevproject");
}

// =================================================
// 🔹 Prevent Multiple Instances
// =================================================
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    // Catch deep link URL when a second instance is launched
    const deepLink = commandLine.pop();
    if (deepLink?.startsWith("mynextdevproject://")) {
      mainWindow?.webContents.send("auth-token-url", deepLink);
    }
  });
}
ipcMain.handle("oauth-google-start", async () => {
  await startGoogleLogin();
  return { success: true };
});

app.on("open-url", async (event, url) => {
  event.preventDefault();
  console.log("🪄 Deep link triggered:", url);

  if (!mainWindow) {
    deeplinkUrl = url;
    return;
  }

  // 👇 Focus the Electron window — this fixes your “need to click again” bug
  if (mainWindow.isMinimized()) mainWindow.restore();
  mainWindow.show();
  
  mainWindow.focus();
    mainWindow.webContents.focus(); 

  try {
    // Option 1: if you want to verify token here
    const tokens = await handleAuthCallback(url);
    mainWindow.webContents.send("oauth-success", tokens);
  } catch (err: any) {
    console.error("OAuth Error:", err);
    mainWindow.webContents.send("auth-token-url", url); // still forward it to renderer
  }
});

app.on("ready", () => {
  const deepLinkArg = process.argv.find((arg) =>
    arg.startsWith("mynextdevproject://")
  );
  if (deepLinkArg) {
    deeplinkUrl = deepLinkArg;
    console.log("🪄 App launched with deep link:", deeplinkUrl);
  }
});

// =================================================
// 🔹 Create Browser Window
// =================================================
async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // ✅ Allow only safe external URLs to open
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (
      url.startsWith("https://accounts.google.com") ||
      url.startsWith("https://my-next-dev-project.onrender.com")
    ) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("ready-to-show", () => mainWindow?.show());

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    await mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    await mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  // Pass deep link (if launched with one) to renderer
  mainWindow.webContents.once("did-finish-load", () => {
    if (deeplinkUrl) {
      console.log("📨 Sending deep link to renderer:", deeplinkUrl);
      mainWindow?.webContents.send("auth-token-url", deeplinkUrl);
      deeplinkUrl = null;
    }
  });

  return mainWindow;
}

// =================================================
// 🔹 App Lifecycle
// =================================================
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.mynextdevproject");

  // Watch for F12, Ctrl+R, etc. only in dev mode
  app.on("browser-window-created", (_, w) => optimizer.watchWindowShortcuts(w));

  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// =================================================
// 🔹 Auto-Updater Configuration
// =================================================
autoUpdater.logger = log;
log.transports.file.level = "info";
app.setPath("userData", path.join(app.getPath("appData"), "MyNextDevProject"));
