 
import { JSX } from "react"
import { postRequest } from "@renderer/functions/requests"
import { ProjectForm } from "./ProjectForm"

 export const AddNewProjectForm =():JSX.Element=>{  
   return(
      <>
         <ProjectForm onSubmit={postRequest}/>
      </>
   )
 }