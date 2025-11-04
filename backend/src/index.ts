

import dotenv from 'dotenv';
import path from 'path'
import { Request, Response } from 'express';
import { getAuth } from "firebase-admin/auth";
import admin from "firebase-admin";
// Point to the correct location of .env manually
dotenv.config({ path: path.resolve(__dirname, '../.env') }) // ✅
import { router } from './project_ideas_db';
import cors from 'cors';
import express from 'express'
import listEndpoints from "express-list-endpoints";
const app = express();
const PORT = 3000
// 👇 Serve your built React files
console.log("tehe static start")
app.use(express.static(path.join(__dirname, "out/renderer")));
console.log("the /* route")


console.log("🧭 Registered routes:", listEndpoints(app));
// Start the server
console.log("server is staring")
app.use(cors())
app.use(express.json())
app.use("/database",router)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}



// 1) Browser sign-in page (runs Firebase in the browser)
app.get("/start-auth", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html>
<head><meta charset="utf-8"/></head>
<body>
<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } 
    from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";

  // 🔒 Use the SAME config as your app (safe to embed apiKey etc.)
  const firebaseConfig = {
    apiKey: "${process.env.VITE_FIREBASE_API_KEY}",
    authDomain: "${process.env.VITE_FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.VITE_FIREBASE_PROJECT_ID}",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  // After returning from Google, Firebase puts the result here:
  getRedirectResult(auth).then(async (result) => {
    if (result && result.user) {
      const idToken = await result.user.getIdToken();
      // 🔁 Bounce to your deep link bridge page
      window.location.href = "/auth/redirect?token=" + encodeURIComponent(idToken);
    } else {
      // First visit (no result yet) → start Google redirect flow
      signInWithRedirect(auth, provider);
    }
  }).catch((err) => {
    document.body.innerText = "Auth error: " + (err?.code || err?.message || err);
  });
</script>
</body>
</html>`);
});

// 2) Deep link bridge page: converts token → mynextdevproject://…
app.get("/auth/redirect", (req, res) => {
  const token = req.query.token || "";
  res.type("html").send(`<!doctype html>
<html>
<body>
<script>
  const token = ${JSON.stringify(String(token))};
  if (!token) document.body.innerText = "Missing token";
  else window.location.href = "mynextdevproject://auth?token=" + encodeURIComponent(token);
</script>
</body>
</html>`);
});
app.use((req: Request,res:Response)=>{
  res.status(404).json({message:"end point not found"})
})
app.get('/', (req:Request, res:Response) => {
  res.send('Hello from backend!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


console.log("🧭 Registered routes:", listEndpoints(app));