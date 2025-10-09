import { app, BrowserWindow, shell } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import icon from "../../resources/icon.png?asset";

let mainWindow: BrowserWindow | null = null;
app.on("web-contents-created", (_, contents) => {
  contents.on("console-message", (_, level, message) => {
    if (message.includes("Cross-Origin-Opener-Policy")) return; // ignore this warning
    console.log(message); // log everything else normally
  });
});
// =======================
// 🔹 MAIN WINDOW FUNCTION
// =======================
function createWindow() {
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
      return { action: "deny" }; // Prevent Electron from handling it internally
    }
    return { action: "allow" };
  });

  if (is.dev) mainWindow.webContents.openDevTools({ mode: "detach" });

  mainWindow.on("ready-to-show", () => mainWindow?.show());

  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return mainWindow;
}

// =======================
// 🔹 APP EVENTS
// =======================
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, w) => optimizer.watchWindowShortcuts(w));
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
