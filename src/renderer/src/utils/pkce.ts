export const generatePKCEPair=async():Promise<{
    codeVerifier: string;
    codeChallenge: string;
}> =>{
  // 1. Generate Verifier: High-entropy random string (43-128 chars)
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const uint8 = new Uint8Array(64);
  window.crypto.getRandomValues(uint8);
  const codeVerifier = Array.from(uint8)
    .map(x => charset[x % charset.length])
    .join('');

  // 2. Generate Challenge: SHA-256 hash of verifier, Base64-URL encoded
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return { codeVerifier, codeChallenge };
}
