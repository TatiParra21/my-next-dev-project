//import { ResultFromBackendType } from "@renderer/components/FormComponents/ProjectForm";
//import { patchGoalsRequest } from "@renderer/functions/requests"
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import type { GoalsChecklistType } from "@renderer/types";
import { JSX,useState,useRef} from "react"
import { projectDataStore } from "@renderer/store/projectStore";
type GoalsArray = {desc:string, completed:boolean}[]

export const AddGoalsDiv =({goals, editFunc}:{goals: GoalsChecklistType, id?:string, editFunc?:(()=>void) |((goals:GoalsArray)=>void) }):JSX.Element=>{
    const [open, setOpen] =useState<boolean>(false)
     const inputRef = useRef<HTMLInputElement | null>(null)
      const currentEditRef = useRef<HTMLInputElement | null>(null)
     const [newGoals,setNewGoals] = useState<GoalsArray>(goals.goals)
     
     const [editGoalNum,setEditGoalNum]= useState<number|null>(null)
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
    </div>         }      
 </div>)
       })}</FormGroup>  :<p>No goals yet</p>
    
    return(
        <div>
            {userGoals}
            <button onClick={openChecklistEditor}>{open ? "close" : "open"}</button>
            <label htmlFor="write-goal">Set Goal</label>
            <input ref ={inputRef} type="text" id="write-goal" name="write-goal"/>
            <button onClick={addGoal} >Add Goal</button>
            <button onClick={()=>editFunc(newGoals)}>Save Changes</button>
            
        </div>
    )
}