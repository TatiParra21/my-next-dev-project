

import dotenv from 'dotenv';
import path from 'path'
import { Request, Response } from 'express';

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
//  Fallback to index.html for React Router
app.get(/^\/(?!api|database).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "out/renderer/index.html"));
});

console.log("🧭 Registered routes:", listEndpoints(app));
// Start the server
console.log("server is staring")
app.use(cors())
app.use(express.json())
app.use("/database",router)
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