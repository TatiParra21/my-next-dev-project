
import { JSX } from "react"
import { deleteRequest } from "@renderer/functions/requests"
import { type ProjectDataStoreType,projectDataStore, warningStore,supabaseStore } from "@renderer/store/projectStore"
import { NavLink } from "react-router-dom";
export const DeleteWarning =({on, id}:{on:boolean, id:string}): JSX.Element =>{
    const setWarning = warningStore(state=>state.setWarning)
    const userId = supabaseStore(state=>state.userId)
    const {loading, setFirstTime}:ProjectDataStoreType = projectDataStore(state=>state)
    if(loading){
        return <div>...Loading</div>
    }
    const deleteRequestAndReset =():void=>{
        deleteRequest(id, userId!)
        setTimeout(()=>setFirstTime(false),0)
        setFirstTime(true)
         setWarning()
    }
return(<>
 {on && 
    <div className="delete-warning">
        <div className=" flex colum align">
            <h2>Are you sure you want to Delete this project?</h2>
            <div className="delete-options flex row edit-delete-sec">
                <NavLink state={{save:null}} to="/project-ideas">
                    <button onClick={deleteRequestAndReset}>Delete Project</button>
                </NavLink>
                <button onClick={setWarning}>Do not Delete Project</button>
            </div>
        </div>
    </div>
    }
</>
    )
}