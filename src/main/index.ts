import { app, BrowserWindow, shell } from "electron";
import { join } from "path";
import express from "express";
import { fileURLToPath } from "url";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

const __dirname = join(fileURLToPath(import.meta.url), "..");
let mainWindow: BrowserWindow | null = null;

// 🟢 Start a tiny Express server for production
function startServer(): Promise<number> {
  return new Promise((resolve) => {
    const server = express();
    const port = 5123;

    // Serve your built renderer files
    server.use(express.static(join(__dirname, "../renderer")));

    // React Router fallback
    server.get("*", (_, res) => {
      res.sendFile(join(__dirname, "../renderer/index.html"));
    });

    server.listen(port, () => {
      console.log(`✅ Local server running at http://localhost:${port}`);
      resolve(port);
    });
  });
}

// 🪟 Create the Electron window
async function createWindow() {
  const port = await startServer(); // wait until server is ready

  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === "linux" ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false, // ✅ Needed for Firebase popups
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // ✅ Allow Firebase & Google redirects to open externally
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
    // ✅ Production build — served from localhost
    mainWindow.loadURL(`http://localhost:${port}`);
  }

  return mainWindow;
}
import pkg from "electron-updater";
const { autoUpdater } = pkg;

// 🔹 Optional: logs (helpful for debugging)
import log from "electron-log";
autoUpdater.logger = log;
log.transports.file.level = "info";

app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");

  // Create the main window
  createWindow();

  // ✅ Check for updates automatically
  autoUpdater.checkForUpdatesAndNotify();
});
// ⚙️ App lifecycle
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, w) => optimizer.watchWindowShortcuts(w));
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
