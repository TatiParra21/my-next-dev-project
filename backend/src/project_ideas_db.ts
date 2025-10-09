import express from 'express'
import { pool } from "./db"
import type { Request,Response, Router } from "express"

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
  const errorResponses :Record<string,{message:string}> ={
        '23503':{message: 'Project messes with table constraint'},
        '23505':{message: 'Project already exists'},
        '23502':{message: 'NOt null violation'},
        '42P01':{message:'Table does not exist.'}
      };
router.get("/project-ideas", async(req: Request, res:Response):Promise<void>=>{
  const {user} = req.query
  console.log(user, "user")
    try{
        const result = await pool.query(`SELECT * FROM project_ideas WHERE user_id = $1`,[user])
        console.log(result, "esult")

         if(!Array.isArray(result.rows) ||result.rows.length === 0){
       res.status(200).json({message:"Nothing was Found", found:false})
      }else if(Array.isArray(result.rows) && result.rows.length >= 1){
      
        res.status(200).json({results:result.rows, message:"Project WAS FOUND"})
      }
  }catch(err: any){
      //basically if there is an error code and that error code is in errorResponses object it will send this back
    if (err.code && errorResponses[err.code]){
      res.status(200).json({ message: 'unique constraint is violation.Application is trying to insert a duplicate value into a column that has a unique constraint.', });
    }else{
      console.error("SOMETHING WORNG",err.code)
      res.status(404).json({message:"UNKNOWN ERROR", err: err })
    }    
  }
});

router.post("/write-new-project",async(req:Request, res:Response):Promise<void>=>{
const body = req.body[0] as BodyProjectType
 try{
      if(!body)throw new Error('there was a problem with the body')
      
        const query = `INSERT INTO project_ideas (name,description,categories,completed, user_id) VALUES ($1,$2,$3,$4,$5) RETURNING *;`
        const {name, description ,categories,completed, user_id} = body
        const values = [name, description,categories,completed, user_id]
        
        const result = await pool.query(query,values)
        if(result.rows.length ===0){throw new Error("results too short")}
        else{
          res.status(201).json({result:result.rows, message:"Project was Posted", success:true} )
        }
 }catch(err: any) {
      //basically if there is an error code and that error code is in errorResponses object it will send this back
    if (err.code && errorResponses[err.code]){
      res.status(200).json({  message: errorResponses[err.code].message ,success: false} );
    }else{
      console.error("SOMETHING WORNG",err.code)
      res.status(404).json({message:"UNKNOWN ERROR", success:false, code:err.code, place: "write-new-project"})
    }  
  }
})

router.patch("/project-ideas/:id/edit",async(req:Request,res:Response):Promise<void>=>{
  const id = req.params.id
  const updatedData = req.body
  const user = req.query.user as string
  //const updatedData = body.updatedData
  const allowedFields = ["name", "description","categories","completed"]
  
const fieldsChosen = allowedFields.filter(field=> Object.keys(updatedData).includes(field))
const clauses = fieldsChosen.map((field, index) => `${field} = $${index + 1}`).join(", ")
const values = fieldsChosen.map(field =>{ 
  return updatedData[field]
})
let message: string

  try{
      const query = `UPDATE project_ideas SET ${clauses} WHERE id = ${id} AND user_id = ${user}`
 // console.log(body,"body")
  await pool.query(query, values)
  res.status(200).json({ message: 'Project updated successfully', success:true });

  }catch(err: any) {
      //basically if there is an error code and that error code is in errorResponses object it will send this back
    if (err.code && errorResponses[err.code]){
      res.status(200).json({ message: errorResponses[err.code].message, success:false});
    }else{
      //console.error("SOMETHING WORNG",err.code)
      res.status(404).json({message:"UNKNOWN ERROR", success:false, place: "write-new-project"})
    }  
  }
})


router.delete("/project-ideas/:id",async(req:Request,res:Response)=>{

  try{
    const id = req.params.id
    const userId = req.query.user as string
   
    await pool.query(`DELETE FROM project_ideas WHERE id =$1 AND user_id = $2`,[id,userId])
        res.status(200).json({ message: 'Project deleted successfully',success:true });
  }catch(err: any) {
      //basically if there is an error code and that error code is in errorResponses object it will send this back
    if (err.code && errorResponses[err.code]){
      res.status(200).json({ message: errorResponses[err.code].message});
    }else{
      console.error("failed to delete",err.code)
      res.status(404).json({message:"UNKNOWN ERROR", err: err , place: "write-new-project"})
    }  
  }

})

router.get("/project-ideas:cat", async(req: Request, res:Response):Promise<void>=>{
    try{
        const result = await pool.query(`SELECT * FROM project_ideas;`)

         if(!Array.isArray(result.rows) ||result.rows.length === 0){
       res.status(200).json({message:"Nothing was Found", found:false})
      }else if(Array.isArray(result.rows) && result.rows.length >= 1){
      
        res.status(200).json({results:result.rows, message:"Project WAS FOUND"})
      }
  }catch(err: any){
      //basically if there is an error code and that error code is in errorResponses object it will send this back
    if (err.code && errorResponses[err.code]){
      res.status(200).json({ message: 'unique constraint is violation.Application is trying to insert a duplicate value into a column that has a unique constraint.', });
    }else{
      console.error("SOMETHING WORNG",err.code)
      res.status(404).json({message:"UNKNOWN ERROR", err: err })
    }    
  }
});

router.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ ok: true, now: result.rows[0] });
  } catch (err) {
    console.error("DB connection failed:", err);
    res.status(500).json({ ok: false, });
  }
});