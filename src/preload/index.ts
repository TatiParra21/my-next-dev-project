import { contextBridge, ipcRenderer, shell } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// ✅ Expose Firebase Auth API
contextBridge.exposeInMainWorld("authAPI", {
  oauthGoogle: () => ipcRenderer.invoke("login-with-google"),
});

// ✅ Merge everything safely under ONE window.electron
const mergedElectronAPI = {
  ...electronAPI, // from @electron-toolkit/preload
  ipcRenderer: {
    // ✅ Add your custom IPC listener(s)
    on: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = ["auth-token-url", "check-session", "deep-link"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      }
    },
    send: (channel: string, data?: any) => ipcRenderer.send(channel, data),
  },
  openExternal: (url: string) => shell.openExternal(url),
};

// ✅ Expose everything in one go
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", mergedElectronAPI);
  } catch (error) {
    console.error("Error exposing merged electronAPI:", error);
  }
}
