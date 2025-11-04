import { contextBridge, ipcRenderer, shell } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
contextBridge.exposeInMainWorld("authAPI", {
  oauthGoogle: () => ipcRenderer.invoke("login-with-google"),
})
contextBridge.exposeInMainWorld("electron", {
  ipcRenderer: {
    on: (channel, func) => {
      const validChannels = ["auth-token-url"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (_, ...args) => func(...args));
      }
    },
  },
});
// ✅ Expose only what’s safe for the renderer
contextBridge.exposeInMainWorld("electronAPI", {
  // Send URL to main process to open Google login window
  openGoogleLogin: (url: string) => ipcRenderer.send("open-google-login", url),

  // React listens for session re-checks from main process
  onCheckSession: (callback: () => void) => {
    ipcRenderer.on("check-session", callback);
  },

  // Handle deep link events (optional)
  onDeepLink: (callback: (url: string) => void) => {
    ipcRenderer.on("deep-link", (_, url) => callback(url));
  },

  // Open external links in browser
  openExternal: (url: string) => shell.openExternal(url),
});

// ✅ Expose base Electron API if context isolation is on
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
  } catch (error) {
    console.error("Error exposing electronAPI:", error);
  }
}
