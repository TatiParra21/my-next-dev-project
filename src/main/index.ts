// ================================================
// 🔹 Imports
// ================================================
import { app, BrowserWindow, shell } from "electron";
import path, { join } from "path";
import { fileURLToPath } from "url";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import pkg from "electron-updater";
const { autoUpdater } = pkg;

import log from "electron-log";


// ================================================
// 🔹 Globals
// ================================================
const __dirname = path.dirname(fileURLToPath(import.meta.url));
let mainWindow: BrowserWindow | null = null;


// ================================================
// 🔹 Custom Protocol Registration
// ================================================
// This allows links like mynextdevproject://auth?token=XYZ to open your app
if (process.defaultApp) {
  // Development mode (running via `electron .`)
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("mynextdevproject", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  // Production (installed app)
  app.setAsDefaultProtocolClient("mynextdevproject");
}


// ================================================
// 🔹 Prevent Multiple App Instances
// ================================================
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (_event, commandLine) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }

    // Optional: show info when user reopens via deep link
    const deepLink = commandLine.pop();
    if (deepLink?.startsWith("mynextdevproject://")) {
      mainWindow?.webContents.send("auth-token-url", deepLink);
    }
  });
}


// ================================================
// 🔹 Handle Deep Link Activation (macOS)
// ================================================
app.on("open-url", (event, url) => {
  event.preventDefault();
  console.log("🪄 Deep link triggered:", url);
  if (mainWindow) {
    mainWindow.webContents.send("auth-token-url", url);
  }
});


// ================================================
// 🔹 Create Main Browser Window
// ================================================
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

  // ✅ Allow Firebase/Google URLs to open externally
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (
      url.startsWith("https://accounts.google.com") ||
      url.startsWith("https://identitytoolkit.googleapis.com") ||
      url.startsWith("https://firebaseapp.com") ||
      url.startsWith("https://auth.firebase.com")
    ) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    return { action: "allow" };
  });

  mainWindow.on("ready-to-show", () => mainWindow?.show());

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    // 🧩 Development mode (Vite server)
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    // 🧩 Production build (static files)
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return mainWindow;
}


// ================================================
// 🔹 App Lifecycle Events
// ================================================
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.mynextdevproject");
  app.on("browser-window-created", (_, w) => optimizer.watchWindowShortcuts(w));
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


// ================================================
// 🔹 Auto-Updater Configuration
// ================================================
autoUpdater.logger = log;
log.transports.file.level = "info";
app.setPath("userData", path.join(app.getPath("appData"), "MyNextDevProject"));
