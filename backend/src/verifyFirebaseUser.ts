import admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function verifyFirebaseUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    // ✅ Verify the token
    const decoded = await admin.auth().verifyIdToken(token);
    (req as any).userId = decoded.uid; // attach the verified UID to the request
    next(); // move on to the actual route
  } catch (err) {
    console.error("Firebase verification failed:", err);
    res.status(403).json({ error: "Unauthorized" });
  }
}