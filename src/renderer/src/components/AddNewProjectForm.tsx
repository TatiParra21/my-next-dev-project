 
import { JSX } from "react"
import { postRequest } from "@renderer/functions/requests"
import { ProjectForm } from "./FormComponents/ProjectForm"

const AddNewProjectForm =():JSX.Element=>{  
   return(
      <>
         <ProjectForm onSubmit={postRequest}/>
      </>
   )
 }
 export default AddNewProjectForm