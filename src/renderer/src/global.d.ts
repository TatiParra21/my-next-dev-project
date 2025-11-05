export {};

declare global {
  interface Window {
    electron: {
      openExternal: (url: string) => void;
       googleLogin: () => Promise<any>;
        startGoogleLogin: () => Promise<any>;
      onOAuthSuccess: (callback: (data: any) => void) => void;
      onOAuthError: (callback: (msg: string) => void) => void;
      onAuthToken: (callback: (url: string) => void) => void;
      ipcRenderer: {
        on: (channel: string, func: (...args: any[]) => void) => void;
        send: (channel: string, data?: any) => void;
      };
    };

    authAPI: {
      oauthGoogle: () => Promise<{ success: boolean; url?: string; message?: string }>;
    };
  }
}

