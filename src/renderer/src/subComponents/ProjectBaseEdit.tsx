import { JSX } from "react"
import {useParams, NavLink } from "react-router-dom"
import { projectDataStore, firebaseStore, selectUserId} from "@renderer/store/projectStore"
import { ProjectForm, type ResultFromBackendType } from "./ProjectForm"
import { patchRequest } from "@renderer/functions/requests"
import type { ProjectType, ProjectFormSubmitType } from "@renderer/types"
import { compareForms, type CompareResults } from "@renderer/functions/compareForms"

 const ProjectBaseEdit =():JSX.Element=>{
 const params = useParams()
 const idState :string |undefined = params.id
 if(!idState) throw new Error("no idea param")
  const projects = projectDataStore(state=>state.projects)
const  loading = projectDataStore(state=>state.loading)
const userId = firebaseStore(selectUserId)
if(!projects) return <>No projects yet</>
     const projectInfo :ProjectType |undefined = projects.find((pro: ProjectType)=>idState == pro.id)
     if(!projectInfo || loading)return<h2>...Loading Project</h2>
      const { id, ...projectWithoutId}=projectInfo
      const patchRequestCheck =async(body: Array<ProjectFormSubmitType> ):Promise<ResultFromBackendType |null>=>{
      const mainBody :ProjectFormSubmitType = body[0]
        const updatedResults : CompareResults= compareForms({original:projectWithoutId,updated:mainBody})
        const request: Promise<ResultFromBackendType | null> = patchRequest(idState,userId!, updatedResults )
          
          return request 
}    
 return(
    <>
    <NavLink state={{save:null}} to="/dashboard">
                    <button>X</button>
                </NavLink>
      <ProjectForm onSubmit={patchRequestCheck} initialValues={projectWithoutId} />
    </>
 )
}

export default ProjectBaseEdit