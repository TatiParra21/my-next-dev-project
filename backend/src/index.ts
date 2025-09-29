

import dotenv from 'dotenv';
import path from 'path'
import { Request, Response } from 'express';
// Point to the correct location of .env manually
dotenv.config({ path: path.resolve(__dirname, '../.env') }) // ✅


import { router } from './project_ideas_db';
import cors from 'cors';
import express from 'express'

const app = express();
const PORT = process.env.PORT || 5000;
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

