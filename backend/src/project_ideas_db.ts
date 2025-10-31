import express from 'express'
import { pool } from "./db"
import type { Request,Response, Router } from "express"
import { verifyFirebaseUser } from './verifyFirebaseUser'
export const router: Router = express.Router()

type BodyProjectType ={
  name: string,
  description: string,
  categories:{
      languages: {label: Capitalize<string>, value:Lowercase<string>}[],
      frameworks: {label: Capitalize<string>, value:Lowercase<string>}[],
      libraries: {label: Capitalize<string>, value:Lowercase<string>}[],
    },
  completed: boolean, 
  user_id:string 
};
type FilterRequestType ={
  categories?:{
      languages: {label: Capitalize<string>, value:Lowercase<string>}[],
      frameworks: {label: Capitalize<string>, value:Lowercase<string>}[],
      libraries: {label: Capitalize<string>, value:Lowercase<string>}[],
    },
  completed?: boolean, 
};
  const errorResponses :Record<string,{message:string}> ={
        '23503':{message: 'Project messes with table constraint'},
        '23505':{message: 'Project already exists'},
        '23502':{message: 'NOt null violation'},
        '42P01':{message:'Table does not exist.'},
        '42703':{message:'undefined colum.'}
      };

const handleDbError =(res:Response, err:any, place?:string)=>{
         if (err.code && errorResponses[err.code]){
      res.status(200).json({ message:errorResponses[err.code].message,  success:false });
    }else{
      console.error("SOMETHING WORNG",err.code)
      res.status(404).json({message: "UNKNOWN ERROR", errorCode: err.code, success: false, place})
    }    

      };
router.get("/project-ideas",verifyFirebaseUser, async(req: Request, res:Response):Promise<void>=>{
  const user = (req as any).userId
    try{
        const result = await pool.query(`SELECT * FROM project_ideas WHERE user_id = $1`,[user])
         if(!Array.isArray(result.rows) ||result.rows.length === 0){
       res.status(200).json({message:"Nothing was Found", found:false})
      }else if(Array.isArray(result.rows) && result.rows.length >= 1){
        res.status(200).json({results:result.rows, message:"Project WAS FOUND"})
      }
  }catch(err: any){
      //basically if there is an error code and that error code is in errorResponses object it will send this back
      handleDbError(res,err,"project-ideas")
  }
});

router.post("/write-new-project",verifyFirebaseUser,async(req:Request, res:Response):Promise<void>=>{
  const body = req.body[0] as BodyProjectType
   const user_id = (req as any).userId
  try{
      if(!body)throw new Error('there was a problem with the body')
        const query = `INSERT INTO project_ideas (name,description,categories,completed, user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
        const {name, description ,categories,completed} = body
        const values = [name, description,categories,completed, user_id]       
        const result = await pool.query(query,values)
        if(result.rows.length ===0){throw new Error("results too short")}
        else{
          res.status(201).json({result:result.rows, message:"Project was Posted", success:true} )
        }
 }catch(err: any) {
  console.log("therre was an errror")
      //basically if there is an error code and that error code is in errorResponses object it will send this back
    handleDbError(res,err,"write-new-project")
  }
})
router.patch("/project-ideas/:id/edit",verifyFirebaseUser,async(req:Request,res:Response):Promise<void>=>{
  const id = Number(req.params.id)
  const updatedData = req.body
   const user = (req as any).userId
  const allowedFields = ["name", "description","categories","completed"]
  const fieldsChosen = allowedFields.filter(field=> Object.keys(updatedData).includes(field))
  const clauses = fieldsChosen.map((field, index) => `${field} = $${index + 1}`).join(", ")
  const values = fieldsChosen.map(field =>{ 
     return updatedData[field]
    })
  try{
      const query = `UPDATE project_ideas
                   SET ${clauses}
                   WHERE id = ${id}
                   AND user_id = '${user}'`;
      await pool.query(query,values)
      res.status(200).json({ message: 'Project updated successfully', success:true });
  }catch(err: any) {
    handleDbError(res,err,`project-ideas/${id}/edit`)
  }
})
router.delete("/project-ideas/:id",verifyFirebaseUser,async(req:Request,res:Response)=>{
  try{
     const userId = (req as any).userId
    const id:number = Number(req.params.id)
    
    await pool.query(`DELETE FROM project_ideas WHERE id =$1 AND user_id = $2`,[id,userId])
        res.status(200).json({ message: 'Project deleted successfully',success:true });
  }catch(err: any) {
     handleDbError(res,err,`project-ideas/`)
  }
})

router.get("/project-ideas/filter",verifyFirebaseUser, async(req: Request, res:Response):Promise<void>=>{
    try{
      const body = req.body as FilterRequestType
       const user_id = (req as any).userId
         const result = await pool.query(
      `SELECT * FROM project_ideas WHERE user_id = $1`,
      [user_id]
    );
         if(!Array.isArray(result.rows) ||result.rows.length === 0){
       res.status(200).json({message:"Nothing was Found", found:false})
      }else if(Array.isArray(result.rows) && result.rows.length >= 1){
        res.status(200).json({results:result.rows, message:"Project WAS FOUND"})
      }
  }catch(err: any){
    handleDbError(res,err,"project-ideas:cat")
  }
});