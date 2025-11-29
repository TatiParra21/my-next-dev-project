

import { useLocation } from "react-router-dom"
import { projectDataStore, selectLoading, selectProjects } from "@renderer/store/projectStore"
import { ProjectType } from "@renderer/types"
import { ProjectBase } from "./ProjectBase";
import { useState, useRef, useEffect, JSX } from "react";
import clsx from "clsx";
import { FilterTab } from "@renderer/components/FormComponents/FilterTab";
export const SelectionCell =({project,save, show,showInfo}:{
    project:ProjectType,
    save:string, 
    show:string | null,
    showInfo:(id:string)=> void
}):JSX.Element =>{
  const projectRef = useRef<HTMLButtonElement | null>(null);
    useEffect(()=>{    
        if(show == project.id && projectRef.current){
             projectRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
             projectRef.current.focus()
        }
    },[show, project.id])
     return(
            <div  className="project-select-cell flex colum"  >
                {/* <NavLink state={{save:`${save}/${project.id}`,}} to={`${project.id}`}>{project.name}</NavLink> */}
                <button ref={projectRef}  tabIndex={-1} className="flex colum select-btn" onClick={()=>showInfo(project.id)}>{project.name}</button>
                {show == project.id &&
                
                    <ProjectBase projectInfo={project} state={{save:`${save}/${project.id}`}} />  
                }    
            </div>)
}
const ProjectSelectionBase =():JSX.Element=>{
    /* the show is to show the info of the selected cell, ths show value will be set to the id of the chosen cell, if you click the 
    same cell, it will be set to null closing the cell
    */
    const [show, setShow] = useState<string |null>(null)
    const showInfo =(id:string): void=>{
    setShow(prev=> prev == id ?null : id)
}
      const location = useLocation()
    const save :string= `${location.pathname}`
    const projects : ProjectType[] | [] = projectDataStore(selectProjects)
    console.log(projects, "seeing")
    const loading :boolean = projectDataStore(selectLoading)
    if(!projects){
         if(loading){
    return<div>...Loading hello</div>
    }else {
         return<div>No projects yet</div>
        }
    }  
   const projectSelection :JSX.Element[] = projects.map((project:ProjectType)=>{
        return(
           <SelectionCell show={show} showInfo={showInfo} key={project.id} project={project} save={save}/>)
})
    return(<>
        <FilterTab/>
        <div className={clsx("all-project-cells", show && "adjust-cells")}>
            {projects.length == 0 && <>NO PROJECTS</>}
            {projectSelection} 
        </div>
    </>
    )
}

export default ProjectSelectionBase