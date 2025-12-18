export {};

declare global {
  interface Window {
    electron: {
      openExternal: (url: string) => void;
        startGoogleLogin: () => Promise<void>;
      onAuthToken: (callback: (url: string) => void) => void;
    };
      secureAuth: {
      saveToken: (token: string) => Promise<void>;
      getToken: () => Promise<string | null>;
      clearToken: () => Promise<void>;
    };

    authAPI: {
      oauthGoogle: () => Promise<{ success: boolean; url?: string; message?: string }>;
    };
  }
}

declare global {
  interface Window {
    api: {
      startGoogleLogin: (
        codeVerifier: string,
        codeChallenge: string
      ) => Promise<GoogleAuthResult>;

      logout: () => Promise<boolean>;
      isLoggedIn: () => Promise<boolean>;
      getAccessToken: () => Promise<string>;
      getProfile:()=>Promise<GoogleUserProfile | null>
    };
  }
}