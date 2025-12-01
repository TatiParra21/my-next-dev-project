import {  NavLink } from "react-router-dom"
import { JSX,useState} from "react"
import type { ProjectType,CategoriesTypeObjArr, GoalsChecklistType } from "@renderer/types"
import { AddGoalsDiv } from "@renderer/subComponents/AddGoalsDiv"
import { DeleteWarning } from "@renderer/subComponents/DeleteWarning"
import { projectDataStore} from "@renderer/store/projectStore"
import { patchGoalsRequest } from "@renderer/functions/requests"
import { ResultFromBackendType } from "./FormComponents/ProjectForm"

const capitalizeFirstLetter =(value: string):string=>{
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
type LabelsOnly ={
    languages: Capitalize<string>[] | undefined;
    frameworks: Capitalize<string>[] | undefined;
    libraries: Capitalize<string>[] | undefined;
}
const extractLabels =(categories?:CategoriesTypeObjArr):LabelsOnly=>{
        return {
        languages: categories?.languages?.map(val=>val.label) ,
        frameworks: categories?.frameworks?.map(val=>val.label) ,
        libraries: categories?.libraries?.map(val=>val.label )
        }
    }
export const CategoryElements = ({arr}:{arr:LabelsOnly}): JSX.Element=>{  
    const labelElements: JSX.Element[] = Object.entries(arr).map(([key, values])=>{
        return(<h3 key={`${key}-key`}><span className="category-class">{capitalizeFirstLetter(key)}: </span>{`${values?.join(", ") ?? " "} `}</h3>)
    })
   return <>
   {labelElements}
   </>
}
type GoalsArray = {desc:string, completed:boolean}[]
export const ProjectBase =({state, projectInfo}:{state:{save:string}, projectInfo:ProjectType}): JSX.Element=>{
    const [warning, setWarning] = useState<boolean>(false)
    const updateProjects = projectDataStore(s=>s.updateProjects)
    const setOpenedProject = projectDataStore(s=>s.setOpenedProject)
    const toggleWarning =():void=>{
      setWarning(prev=>!prev)
    }
  const projectGoals: GoalsChecklistType = projectInfo.goals_checklist
   const labels :LabelsOnly = extractLabels(projectInfo.categories)
    const save :string = state.save  

    const submitGoals =async(newGoals:GoalsArray):Promise<void>=>{
        const res :ResultFromBackendType | null= await patchGoalsRequest(projectInfo.id,{goals:newGoals})
        console.log(res, "res form submit")
        if(res && res.success)updateProjects()
    }
    return(
        <div className="flex colum">
             <DeleteWarning toggleWarning={toggleWarning} on={warning} id={projectInfo.id} />    
           <div className="middle-part flex colum">
            <div>
                <h2><span className="category-class">Name:</span>{` ${projectInfo.name}`}</h2>
                <CategoryElements arr={labels}/>
            </div>
            <label className="category-class" htmlFor="desc">Description: </label>
            <p>{`Completed: ${projectInfo.completed ? "YES" : "NO"}`}</p>
            <p id="desc" >  {projectInfo.description}</p>
            
            </div>
            <AddGoalsDiv source="project-base" editFunc={submitGoals} goals={projectGoals.goals}/>
             <div className="flex row edit-delete-sec">
                <NavLink onClick={()=>{ setOpenedProject(projectInfo)}} className="other-nav "  state={{save:save, from:"/project-ideas"}} to={save}>Edit</NavLink>
                <button className="text-red-400 border-2 border-red-400 py-0 px-2" onClick={toggleWarning} >Delete</button>
            </div>
        </div>
    )
}

