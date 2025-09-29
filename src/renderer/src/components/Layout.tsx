import { NavBar } from "./NavBar"
import { Outlet, useLocation } from "react-router-dom"
import { useEffect, JSX } from "react"
import { fetchRequest } from "../functions/requests" 
import { RouteShown } from "./RouteShown"
import type { CategoriesTypeObjArr, ProjectType } from "@renderer/types"
import {supabaseStore, projectDataStore,selectFirstTime,selectSetFirstTime,selectLoading, selectSetLoading, selectSetError,selectSetProjects, selectError } from "@renderer/store/projectStore"
import { handleError } from "@renderer/functions/handleError"
export const otherDefault:CategoriesTypeObjArr ={
    languages:[{value:"",label:""}],
    frameworks:[{value:"",label:""}],
    libraries:[{value:"",label:""}]
}
   export type ProjectTypeContext ={
        projects: ProjectType[],
        setProjects:  React.Dispatch<React.SetStateAction<boolean>>;
    }
export const Layout =(): JSX.Element=>{
   const userId = supabaseStore(state=>state.userId)
    const setProjects = projectDataStore(selectSetProjects)
    const  firstTime = projectDataStore(selectFirstTime)
    const setFirstTime = projectDataStore(selectSetFirstTime)
    const loading = projectDataStore(selectLoading)
    const setLoading = projectDataStore(selectSetLoading)
    const error = projectDataStore(selectError)
    const  setError = projectDataStore(selectSetError)
    const reload=()=>{
        setError(null)
        setFirstTime(false); // ensure a change
        setTimeout(() => setFirstTime(true), 0);
    }
    const location = useLocation()
    const currentRoute2 = location.pathname
    useEffect(()=>{  
         if(!firstTime)return
           setLoading(true)
           console.log("whaa5 happenned")
            const getData: ()=>Promise<void> =async()=>{
            try{
                if(!userId)throw new Error("user iid unknown")
                const projects:ProjectType[] | null = await fetchRequest(userId)
               
                     setProjects(projects)
            
                 setFirstTime(false)
               
               
            }catch(err){
                const errorMessage=  handleError(err, "Layout")
                setError(errorMessage)
            }finally{
                setLoading(false)
            }
         }
        getData()      
},[firstTime])
if(loading){
    return(<div>     
       <span>...Loading Projects</span>         
        </div>)
}
if(error && !loading){
    return(
        <div>
            <button onClick={reload}>Reload</button>
            <span>{`Error: ${error}`}</span>
        </div>)
}
    return(
<>
    <header>
    <button onClick={reload}>Reload</button>
        <RouteShown route={currentRoute2}/> 
        <NavBar/>
    </header>
    <section className="full-form flex  colum">
        <Outlet/>
    </section>

</>
    )
}