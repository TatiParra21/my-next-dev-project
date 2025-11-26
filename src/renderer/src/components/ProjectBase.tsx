import {  NavLink } from "react-router-dom"
import { JSX,useState,useRef} from "react"
import type { ProjectType,CategoriesTypeObjArr, GoalsChecklistType } from "@renderer/types"
import { ResultFromBackendType } from "./FormComponents/ProjectForm"
import { DeleteWarning } from "@renderer/subComponents/DeleteWarning"
import { projectDataStore,selectLoading, selectProjects} from "@renderer/store/projectStore"
//import { capitalizeFirstLetter } from "@renderer/components/FormComponents/ProjectForm"
import { patchGoalsRequest } from "@renderer/functions/requests"
import Checkbox from '@mui/material/Checkbox';
//import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
//import FormLabel from '@mui/material/FormLabel';
import FormGroup from '@mui/material/FormGroup';
const capitalizeFirstLetter =(value: string):string=>{
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
type LabelsOnly ={
    languages: Capitalize<string>[] | undefined;
    frameworks: Capitalize<string>[] | undefined;
    libraries: Capitalize<string>[] | undefined;
}

type GoalsArray = {desc:string, completed:boolean}[]
export const AddGoalsDiv =({goals, id}:{goals: GoalsChecklistType, id:string}):JSX.Element=>{
    const [open, setOpen] =useState<boolean>(false)
     const inputRef = useRef<HTMLInputElement | null>(null)
      const currentEditRef = useRef<HTMLInputElement | null>(null)
     const [newGoals,setNewGoals] = useState<GoalsArray>(goals.goals)
     const updateProjects = projectDataStore(s=>s.updateProjects)
     const [editGoalNum,setEditGoalNum]= useState<number|null>(null)
     console.log("new gaols",newGoals, goals)
     const removeGoal =(i:number):void=>{
      const removedGoals  = newGoals.splice(i,1)
      setNewGoals(removedGoals)

     }
     const editGoal =():void=>{
       const editedGoalText = currentEditRef.current && currentEditRef.current.value.length >0 ? currentEditRef.current.value : ""
      const goalsEdited = newGoals.map((goal,index)=>index==editGoalNum ? {...goal,desc:editedGoalText}:goal)
      setNewGoals(goalsEdited)
      setEditGoalNum(null)


     }
     const addGoal =():void=>{
        const newGoal = inputRef.current && inputRef.current.value.length >0 ? inputRef.current.value : ""
       setNewGoals([...(newGoals ?? []), {desc:newGoal, completed:false}]);
     }
     const editBox =(i:number):void=>{
          setNewGoals(prev =>prev.map((g, index) =>
            index === i ? { ...g, completed: !g.completed } : g
          )
        );
     }
        const openChecklistEditor =():void=>{
            setOpen(prev=>!prev)
        }
       
       const userGoals:JSX.Element = newGoals && newGoals.length >0 ? <FormGroup> {newGoals.map((goal,i)=>{
        return(
        <div  key={`goal-${i}`}  >

          {i == editGoalNum ?
          <div>
             <input ref={currentEditRef} type="text" defaultValue={goal.desc}></input>
             <button onClick={editGoal}>save</button>
             <button onClick={()=>setEditGoalNum(null)}>cancel</button>
            
             </div>
          :
          <div>
          <FormControlLabel
        
        label={goal.desc}
        control={    <Checkbox
        checked={goal.completed}
        onChange={() => {
        editBox(i)
      }}
      sx={{
        color: "white", // visible outline when unchecked
        "&.Mui-checked": {
          color: "#3b82f6", // blue when checked
        }
      }}  />} 
      />
      <button onClick={()=>{setEditGoalNum(i)}} >Edit</button>
      <button onClick={()=>removeGoal(i)} >X</button> 
</div>
          
          }
        

 </div>)
       })}</FormGroup>  :<p>No goals yet</p>
    const submitGoals =async():Promise<void>=>{
        const res :ResultFromBackendType | null= await patchGoalsRequest(id,{goals:newGoals})
        console.log(res, "res form submit")
        if(res && res.success)updateProjects()

    }
    return(
        <div>
            {userGoals}
            <button onClick={openChecklistEditor}>{open ? "close" : "open"}</button>
            <label htmlFor="write-goal">Set Goal</label>
            <input ref ={inputRef} type="text" id="write-goal" name="write-goal"/>
            <button onClick={addGoal} >Add Goal</button>
            <button onClick={submitGoals}>Save Changes</button>
            
        </div>
    )
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
export const ProjectBase =({state, id}:{state:{save:string}, id:string}): JSX.Element=>{
   // const warning:boolean =  warningStore(s=>s.warning)
   // const setWarning:()=>void  = warningStore(s=>s.setWarning)
    const [warning, setWarning] = useState<boolean>(false)
    const toggleWarning =():void=>{
      setWarning(prev=>!prev)
    }
    if(!id)throw new Error(" id not found")
     
    const projects: ProjectType[] | null  = projectDataStore(selectProjects)
     console.log(projects, "projects")
    const loading  = projectDataStore(selectLoading)
    if(!projects || loading)return <h2>...Loading inn ProjetBa</h2>
          const projectInfo :ProjectType | undefined = projects.find((pro: ProjectType)=>id == pro.id)
    if(!projectInfo )return <h2>...Loading</h2>
  const projectGoals: GoalsChecklistType = projectInfo.goals_checklist
 
   const labels :LabelsOnly = extractLabels(projectInfo.categories)
    const save :string = state.save  
    return(
        <div className="flex colum">
             <DeleteWarning toggleWarning={toggleWarning} on={warning} id={id} />    
           <div className="middle-part flex colum">
            <div>
                <h2><span className="category-class">Name:</span>{` ${projectInfo.name}`}</h2>
                <CategoryElements arr={labels}/>
            </div>
            <label className="category-class" htmlFor="desc">Description: </label>
            <p id="desc" >  {projectInfo.description}</p>
            <p>{`Completed: ${projectInfo.completed ? "YES" : "NO"}`}</p>
            </div>
            <AddGoalsDiv id={id} goals={projectGoals}/>
             <div className="flex row edit-delete-sec">
                <NavLink className="other-nav"  state={{save:save, from:"/project-ideas"}} to={save}>Edit</NavLink>
                <button onClick={toggleWarning} >Delete</button>
            </div>
        </div>
    )
}

