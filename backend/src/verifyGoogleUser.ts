// import { Request, Response, NextFunction } from "express";
// import { oAuth2Client } from "./index";
// export default async function verifyGoogleUser(req:Request, res:Response, next:NextFunction) {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       return res.status(401).json({ error: "No token provided" });
//     }
//     const token = authHeader.replace("Bearer ", "");
//     // Use the *same* client
//     const ticket = await oAuth2Client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });
//    const payload = ticket.getPayload();
//     if (!payload) {
//       res.status(401).json({ error: "Invalid token payload" });
//       return;
//     }
//      (req as any).userId = payload.sub;
//     (req as any).userEmail = payload.email;
//     next();
//   } catch (err) {
//     console.error("Token verification failed:", err);
//     return res.status(401).json({ error: "Invalid or expired token" });
//   }
// }
