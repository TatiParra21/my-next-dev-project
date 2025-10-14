
import { JSX } from "react"
import { deleteRequest } from "@renderer/functions/requests"
import { type ProjectDataStoreType,projectDataStore, warningStore,firebaseStore, selectUserId, selectUpdateProjects} from "@renderer/store/projectStore"
import { NavLink } from "react-router-dom";
export const DeleteWarning =({on, id}:{on:boolean, id:string}): JSX.Element =>{
    const setWarning = warningStore(state=>state.setWarning)
    const userId= firebaseStore(selectUserId)
    const updateProject = projectDataStore(selectUpdateProjects)
    const {loading}:ProjectDataStoreType = projectDataStore(state=>state)
    if(loading){
        return <div>...Loading</div>
    }
    const deleteRequestAndReset =async():Promise<void>=>{
       await deleteRequest(id, userId!)
       await updateProject(userId!)     
         setWarning()
    }
return(<>
 {on && 
    <div className="delete-warning">
        <div className=" flex colum align">
            <h2>Are you sure you want to Delete this project?</h2>
            <div className="delete-options flex row edit-delete-sec">
                <NavLink state={{save:null}} to="/dashboard">
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