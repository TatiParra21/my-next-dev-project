import crypto from 'crypto';

export const generateCodeVerifier =():{
    codeVerifier: string;
    codeChallenge: string;
}=>{
      // 1. Generate a high-entropy random string for the code_verifier (between 43 and 128 chars long)
    // 32 bytes of random data results in 43 characters after Base64-URL encoding.
    const codeVerifier = crypto.randomBytes(32).toString('base64url');
    const codeHash = crypto.createHash("sha256")
    const codeChallenge = codeHash.update(codeVerifier).digest("base64url")
   
    return {
        codeVerifier,
        codeChallenge,
    };

}

