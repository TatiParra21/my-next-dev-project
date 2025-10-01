export {}

declare global {
  interface Window {
    electronAPI: {
      openGoogleLogin: (url: string) => void
    }
  }
}
