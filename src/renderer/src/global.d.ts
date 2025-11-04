export {}

declare global {
  interface Window {
    electronAPI: {
      openGoogleLogin: (url: string) => void
       onCheckSession: (callback: () => void) => void
        onDeepLink: (callback: (url: string) => void) => void
        openExternal:(url:string)=>void
       
     
    }, electron: {
      ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => void;
      };
  }
}
}
