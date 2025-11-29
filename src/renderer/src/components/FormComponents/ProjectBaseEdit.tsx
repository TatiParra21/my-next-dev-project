import { JSX, useRef } from "react"
import { NavLink } from "react-router-dom"
import { ProjectForm, type ResultFromBackendType } from "./ProjectForm"
import { patchRequest } from "@renderer/functions/requests"
import type { ProjectType, ProjectFormSubmitType } from "@renderer/types"
import { compareForms, type CompareResults } from "@renderer/functions/compareForms"
import { projectDataStore } from "@renderer/store/projectStore"
import { useScrollToComponent } from "@renderer/functions/useScrollToComponent"
const ProjectBaseEdit =():JSX.Element=>{
  const containerRef = useRef<HTMLDivElement | null>(null);
  useScrollToComponent(containerRef)

 const projectInfo: ProjectType | null = projectDataStore(s=>s.openedProject)
 const setOpenedProject = projectDataStore(s=>s.setOpenedProject)
  if(!projectInfo)return <p>...Loading Project information</p>
      const { id, ...projectWithoutId}=projectInfo
      const patchRequestCheck =async(body: Array<ProjectFormSubmitType> ):Promise<ResultFromBackendType |null>=>{
      const mainBody :ProjectFormSubmitType = body[0]
      const updatedResults : CompareResults= compareForms({original:projectWithoutId,updated:mainBody})
      const request: Promise<ResultFromBackendType | null> = patchRequest(id, updatedResults )      
        return request 
  }    

 return(  
    <div ref={containerRef}>
    <NavLink onClick={()=>{setOpenedProject(null)}} state={{save:null}} to="/dashboard/project-ideas">
                    <button>X</button>
                </NavLink>
      <ProjectForm onSubmit={patchRequestCheck} initialValues={projectWithoutId} />
    </div>
 )
}

export default ProjectBaseEdit