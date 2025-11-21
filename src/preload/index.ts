import { contextBridge, ipcRenderer, shell } from "electron";
import { electronAPI } from "@electron-toolkit/preload";

// ✅ Merge all safe APIs into one object and expose it once
const mergedElectronAPI = {
  ...electronAPI, // Built-in Electron toolkit features (already safe)
//REMOVED PART
  // ✅ Allow frontend to open external URLs
  openExternal: (url: string) => shell.openExternal(url),
  startGoogleLogin: () =>
    shell.openExternal("https://my-next-dev-project.onrender.com/auth/google"),
  onAuthToken: async(callback:(url:string)=>void) => {
    //this is returning anEventListerner
    ipcRenderer.on("auth-token-url", (_, url) => callback(url));
  },
  /*
  onOAuthSuccess: (callback: (data: any) => void) =>
    ipcRenderer.on("oauth-success", (_, data) => callback(data)),
  onOAuthError: (callback: (msg: string) => void) =>
    ipcRenderer.on("oauth-error", (_, msg) => callback(msg)),
  */
};

contextBridge.exposeInMainWorld("secureAuth", {
  saveToken: (token: string) => ipcRenderer.invoke("save-token", token),
  getToken: () => ipcRenderer.invoke("get-token"),
  clearToken: () => ipcRenderer.invoke("clear-token"),
});

// ✅ Expose everything safely ONCE
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", mergedElectronAPI);
  } catch (error) {
    console.error("Error exposing electronAPI:", error);
  }
} else {
  // Fallback for disabled context isolation (rare)
  (window as any).electron = mergedElectronAPI;
}

/*
  myIpcRenderer: {
    // ✅ Add limited custom IPC listeners
    on: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = ["auth-token-url", "check-session", "deep-link"];
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (_event, ...args) => func(...args));
      }
    },
    send: (channel: string, data?: any) => ipcRenderer.send(channel, data),
  },
*/