

import { useLocation } from "react-router-dom"
import { projectDataStore, selectLoading, selectProjects } from "@renderer/store/projectStore"
import { ProjectType } from "@renderer/types"
import { ProjectBase } from "./ProjectBase";
import { useState, useRef, useEffect, JSX } from "react";
import { fetchFilteredRequest } from "@renderer/functions/requests";
import clsx from "clsx";
import { FilterTab } from "@renderer/subComponents/FilterTab";
export const SelectionCell =({project,save, show,showInfo}):JSX.Element =>{
  const projectRef = useRef<HTMLButtonElement | null>(null);
    useEffect(()=>{    
        if(show == project.id && projectRef.current){
             projectRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
             projectRef.current.focus()
        }
    },[show])
     return(
            <div  className="project-select-cell flex colum"  >
                {/* <NavLink state={{save:`${save}/${project.id}`,}} to={`${project.id}`}>{project.name}</NavLink> */}
                <button ref={projectRef}  tabIndex={-1} className="flex colum select-btn" onClick={()=>showInfo(project.id)}>{project.name}</button>
                {show == project.id &&
                
                    <ProjectBase state={{save:`${save}/${project.id}`,}} id={project.id} />  
                }    
            </div>)
}
const ProjectSelectionBase =():JSX.Element=>{
    const [show, setShow] = useState<string |null>(null)
    const showInfo =(id:string)=>{
    setShow(prev=> prev == id ?null : id)
}
      const location = useLocation()
    const save :string= `${location.pathname}`
    const projects : ProjectType[] | null = projectDataStore(selectProjects)
    const loading :boolean = projectDataStore(selectLoading)
    if(!projects){
         if(loading){
    return<div>...Loading</div>
    }else {
         return<div>No projects yet</div>
        }
    }
   
   const projectSelection :JSX.Element[] = projects.map((project:ProjectType)=>{
        return(
           <SelectionCell show={show} showInfo={showInfo} key={project.id} project={project} save={save}/>)
})
    return(<>
        <FilterTab onSubmit={fetchFilteredRequest}/>
        <div className={clsx("all-project-cells", show && "adjust-cells")}>
        
            {projectSelection} 
        </div>
    </>
    )
}

export default ProjectSelectionBase