import { NavLink } from "react-router-dom"
import { JSX} from "react"
import type { ProjectType,CategoriesTypeObjArr } from "@renderer/types"
import { DeleteWarning } from "@renderer/subComponents/DeleteWarning"
import { projectDataStore,selectLoading, selectProjects, warningStore} from "@renderer/store/projectStore"
import { capitalizeFirstLetter } from "@renderer/components/FormComponents/ProjectForm"
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
export const ProjectBase =({state, id}): JSX.Element=>{
    const warning =  warningStore(state=>state.warning)
    const setWarning  = warningStore(state=>state.setWarning)
    if(!id)throw new Error(" id not found")
     
    const projects: ProjectType[] | null  = projectDataStore(selectProjects)
     console.log(projects, "projects")
    const loading  = projectDataStore(selectLoading)
    if(!projects || loading)return <h2>...Loading inn ProjetBa</h2>
          const projectInfo :ProjectType | undefined = projects.find((pro: ProjectType)=>id == pro.id)
    if(!projectInfo )return <h2>...Loading</h2>
  
   const labels :LabelsOnly = extractLabels(projectInfo.categories)
    const save :string = state.save  
    return(
        <div className="flex colum">
             <DeleteWarning on={warning} id={id} />    
           <div className="middle-part flex colum">
            <div>
                <h2><span className="category-class">Name:</span>{` ${projectInfo.name}`}</h2>
                <CategoryElements arr={labels}/>
            </div>
            <label className="category-class" htmlFor="desc">Description: </label>
            <p id="desc" >  {projectInfo.description}</p>
            <p>{`Completed: ${projectInfo.completed ? "YES" : "NO"}`}</p>
            </div>
             <div className="flex row edit-delete-sec">
                <NavLink className="other-nav"  state={{save:save, from:"/project-ideas"}} to={save}>Edit</NavLink>
                <button onClick={setWarning} >Delete</button>
            </div>
        </div>
    )
}