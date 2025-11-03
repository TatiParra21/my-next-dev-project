import { app, BrowserWindow, shell } from "electron";
import { join } from "path";
import express from "express";
import { fileURLToPath } from "url";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";
import http from "http";
import path from "path";
import { execSync } from "child_process";

const __dirname = join(fileURLToPath(import.meta.url), "..");
let mainWindow: BrowserWindow | null = null;
let httpServer: http.Server | null = null;
//mynextdevproject://auth

if (process.defaultApp) {
  /*process.defaultApp tells you if you’re running Electron directly from the command line 
  (like when you run electron . during development) instead of as a packaged .exe or .app.
true means you are runninng the app in development, false means you are running a built app */
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('mynextdevproject', process.execPath, [path.resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('mynextdevproject')
}


// ✅ Prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

// 🟢 Start local Express server
async function startServer(): Promise<number> {
  const expressApp = express();
 const port = is.dev ? 5123 : 5173; // fixed port for Google OAuth

  // 💥 Try to free the port before starting
  try {
    const output = execSync(`netstat -ano | findstr :${port}`).toString();
    const match = output.match(/LISTENING\s+(\d+)/);
    if (match && match[1]) {
      const pid = match[1];
      console.log(`🧹 Port ${port} in use by PID ${pid}, killing it...`);
      execSync(`taskkill /PID ${pid} /F`);
      console.log("✅ Old process killed.");
    }
  } catch {
    // no process found — safe to continue
  }

  // Serve renderer files (your React build)
  expressApp.use(express.static(join(__dirname, "../renderer")));

  // React Router fallback
  expressApp.get("*", (_, res) => {
    res.sendFile(join(__dirname, "../renderer/index.html"));
  });

  // Start the server
  httpServer = expressApp.listen(port, () => {
    console.log(`✅ Local server running at http://localhost:${port}`);
  });

  return port;
}

// 🧹 Close Express server when quitting
app.on("before-quit", () => {
  if (httpServer) {
    console.log("🧹 Closing local server...");
    try {
      httpServer.close(() => {
        console.log("✅ Local server closed.");
      });
    } catch (err) {
      console.error("❌ Failed to close local server:", err);
    }
  }
});

// 🪟 Create Electron window
async function createWindow() {
  const port = await startServer(); // Wait for server before loading UI

  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false, // Needed for Firebase/Google popups
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
    // Development build
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    // ✅ Production build — served from local Express
    mainWindow.loadURL(`http://localhost:${port}`);
  }

  return mainWindow;
}

// 🧩 Auto-updater + logs
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import log from "electron-log";
autoUpdater.logger = log;
log.transports.file.level = "info";

// 🗂 Set custom user data path
app.setPath("userData", path.join(app.getPath("appData"), "MyNextDevProject"));

// 🚀 Main startup
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, w) => optimizer.watchWindowShortcuts(w));
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});

// 🧱 Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
