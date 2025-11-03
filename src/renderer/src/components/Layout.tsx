import { NavBar } from "./NavBar"
import { Outlet, useLocation } from "react-router-dom"
import { useEffect, JSX } from "react"
import { RouteShown } from "./RouteShown"
import type { CategoriesTypeObjArr, ProjectType } from "@renderer/types"
import {firebaseStore,selectUser, projectDataStore, selectLoading, selectSetLoading, selectSetError, selectError, selectProjects, selectUserEmail} from "@renderer/store/projectStore"
import { handleError } from "@renderer/functions/handleError"
import { UserMenu } from "@renderer/subComponents/UserMenu"

export const otherDefault:CategoriesTypeObjArr ={
    languages:[{value:"",label:""}],
    frameworks:[{value:"",label:""}],
    libraries:[{value:"",label:""}]
}
   export type ProjectTypeContext ={
        projects: ProjectType[],
        setProjects:  React.Dispatch<React.SetStateAction<boolean>>;
    }
const Layout =(): JSX.Element=>{
    const user = firebaseStore(selectUser)
    const userId = user?.uid || null;
    const email = firebaseStore(selectUserEmail)
    const userProjects:ProjectType[] | [] = projectDataStore(selectProjects)
    const loading = projectDataStore(selectLoading)
    const setLoading = projectDataStore(selectSetLoading)
    const error = projectDataStore(selectError)
    const  setError = projectDataStore(selectSetError)
    const location = useLocation()
    const currentRoute2 = location.pathname
    useEffect(()=>{          
            const getData: ()=>Promise<void> =async()=>{
            try{
                 setLoading(true)
               
            }catch(err){
                const errorMessage=  handleError(err, "Layout")
                setError(errorMessage)
            }finally{      
                setLoading(false)
            }
         }
        getData()      
},[userProjects, userId])

if(error && !loading){
    return(
        <div>
            <span>{`Error: ${error}`}</span>
        </div>)
}
    return(
<>
    <header>
     <UserMenu email={email}/>
        <RouteShown route={currentRoute2}/> 
        <h1 className="text-3xl font-bold text-blue-500">Tailwind works!</h1>

        <NavBar/>
    </header>
    <section className="full-form flex  colum">
        <Outlet/>
    </section>
</>
    )
}

export default Layout