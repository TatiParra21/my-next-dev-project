//import { ResultFromBackendType } from "@renderer/components/FormComponents/ProjectForm";
//import { patchGoalsRequest } from "@renderer/functions/requests"
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import { FaEdit } from "react-icons/fa";
import { JSX,useState,useRef, useEffect} from "react"
//import { projectDataStore } from "@renderer/store/projectStore";
type GoalsArray = {desc:string, completed:boolean}[]

export const AddGoalsDiv =({goals, editFunc, source}:{goals: GoalsArray,source:string, editFunc:(goals:GoalsArray)=>void }):JSX.Element=>{
    const [open, setOpen] =useState<boolean>(false)
     const inputRef = useRef<HTMLInputElement | null>(null)
      const currentEditRef = useRef<HTMLInputElement | null>(null)
     const [newGoals,setNewGoals] = useState<GoalsArray>(goals)
     
     const [editGoalNum,setEditGoalNum]= useState<number|null>(null)
     const [saveButtonActive, setSaveButtonActive] = useState<boolean>(true)
     const removeGoal =(i:number):void=>{
      setNewGoals(prev=>{
        const copy = [...prev]
        copy.splice(i,1)
        return copy
        })
        setSaveButtonActive(false)
     }
     const editGoal =():void=>{
       const editedGoalText = currentEditRef.current && currentEditRef.current.value.length >0 ? currentEditRef.current.value : ""
      const goalsEdited = newGoals.map((goal,index)=>index==editGoalNum ? {...goal,desc:editedGoalText}:goal)
      setNewGoals(goalsEdited)
      setEditGoalNum(null)
      setSaveButtonActive(false)
     }
     const addGoal =():void=>{
        const newGoal = inputRef.current && inputRef.current.value.length >0 ? inputRef.current.value : ""       
       setNewGoals([...(newGoals ?? []), {desc:newGoal, completed:false}]);
       if(inputRef.current && inputRef.current.value.length >0)inputRef.current.value = ""
       setSaveButtonActive(false)
     }
     ///this updates the newGoals in baseEdit, 
     useEffect(()=>{
       if(source == "project-form"){
        editFunc(newGoals)
       }
      console.log("new goals updated")

     },[newGoals,source,editFunc])

    
     const editBox =(i:number):void=>{
          setNewGoals(prev =>prev.map((g, index) =>
            index === i ? { ...g, completed: !g.completed } : g
          )
        );
        setSaveButtonActive(false)
     }
        const openChecklistEditor =():void=>{
            setOpen(prev=>!prev)
        }
       
       const userGoals:JSX.Element = newGoals && newGoals.length >0 ? <FormGroup> {newGoals.map((goal,i)=>{
        return(
        <div  key={`goal-${i}`}  >
          {i == editGoalNum ?
          <div>
             <input className=' bg-white '  ref={currentEditRef} type="text" defaultValue={goal.desc}></input>
             <button type="button" onClick={editGoal}>save</button>
             <button className='border-solid border-green-500 border-2 text-sm p-0' type="button" onClick={()=>setEditGoalNum(null)}>X</button>     
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
      <button type="button" onClick={()=>{setEditGoalNum(i)}} ><FaEdit/></button>
      <button type="button" onClick={()=>removeGoal(i)} >X</button> 
    
    </div>         }      
 </div>)
       })}</FormGroup>  :<p>No goals yet</p>
    
    return(
        <div className=' border-2 p-4 border-white-400'>
            <button type="button" onClick={openChecklistEditor}>{open ? "Hide Goals" : "Show Goals"}</button>
            {open &&<> {userGoals}
            <label  className=' text-gray-100' htmlFor="write-goal">New Goal:</label>
            <input className=' bg-white '  ref ={inputRef} type="text" id="write-goal" name="write-goal"/>
            <button type="button" onClick={addGoal} >Add Goal</button>
            {source  == "project-base" && 
            <button className='submit-btn' disabled={saveButtonActive} 
            type="button" 
            onClick={()=>{editFunc(newGoals); setSaveButtonActive(true)} }>Save Changes</button>} </> }
            
            
            
        </div>
    )
}