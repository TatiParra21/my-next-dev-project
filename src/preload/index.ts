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
  //from my understanding typescript won't let you change the built in window type so 
  // we must first erase its type (unknown) before reasserting a version that includes our custom Electron APIs.
  (window as unknown as { electron: typeof mergedElectronAPI }).electron = mergedElectronAPI;
}
