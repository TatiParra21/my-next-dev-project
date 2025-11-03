import type { ProjectFormSubmitType, ProjectType } from "@renderer/types"
import { handleError } from "./handleError"
import { ResultFromBackendType} from "@renderer/components/FormComponents/ProjectForm"
import { CategoriesTypeObjArr } from "@renderer/types"
import { firebaseStore } from "@renderer/store/projectStore"
import {type User } from "firebase/auth"

type UserTokenObjType = {
    user: User,
    token:string
}
const getFirebaseAuthToken = async():Promise<UserTokenObjType| null>=>{
  const user:User|null = firebaseStore.getState().user
    if (!user) {
        console.warn("No logged-in user");
        return null;
        }
    const token = await user.getIdToken()
    return {user,token}
}
export const fetchRequest =async():Promise<ProjectType[] | []>=>{
    try{         
       const auth = await getFirebaseAuthToken()
        if (!auth) return [];
         const res = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas`,{
            headers:{
                "Authorization": `Bearer ${auth.token}`
            }
         })
     if (!res.ok) {
      console.error("Fetch failed with status", res.status);
      return [];
    }
    const data = await res.json();
    console.log(data, "data from backend");
    if (!data.results) return []; // user may have 0 projects
    return data.results;
    }catch(err){
        handleError(err,"fetchRequest")
        return []     
    }
}
export const postRequest = async(body: Array<ProjectFormSubmitType>):Promise<ResultFromBackendType |null>=>{
     const auth = await getFirebaseAuthToken()
        if (!auth) return null;
    try{
        const response = await fetch(`https://my-next-dev-project.onrender.com/database/write-new-project`,{
    method:"POST",
    headers:{
         "Authorization": `Bearer ${auth.token}`,
        "Content-Type":"application/json"
    },
    body:JSON.stringify(body)
})
        const data  = await response.json()
        console.log(data, "datalogged")
      return data

    }catch(err){
        handleError(err,"postRequest")
        return null
    }
}

export const patchRequest = async(id:string, body:Record<string,any>):Promise<ResultFromBackendType |null>=>{
    try{ 
     const auth = await getFirebaseAuthToken()
        if (!auth) return null;
        console.log(body, "body")
    const response = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas/${id}/edit`,{
        method:"PATCH",
        headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${auth.token}`,
        
    },
        body:JSON.stringify(body)
})
    const data = await response.json()
    console.log(data, "datalogged")
    return data
    }catch(err){
        handleError(err,"patchRequest")
        return null
    }
}
export const deleteRequest =async(id:string):Promise<void |null>=>{
    try{
        console.log(id, "id")
        const auth = await getFirebaseAuthToken()
        if (!auth) return null;
        const res = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas/${id}`,
            {method: "DELETE",
                headers:{
                "Authorization": `Bearer ${auth.token}`
            }
        })
        const data = await res.json()
         console.log("Project was deleted", data)
        return data
    }catch(err){
         handleError(err,"deleteRequest")
        return null
    }
}
type ProjectFilterSubmitType ={
   categories: CategoriesTypeObjArr,
   completed:boolean,
   
}
export const fetchFilteredRequest =async(filtersApplied:ProjectFilterSubmitType):Promise<ResultFromBackendType |[]>=>{
    try{
     const auth = await getFirebaseAuthToken()
        if (!auth) return [];
          const res = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas/filter`,{
        method:"GET",
        headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${auth.token}`,
    },
        body:JSON.stringify(filtersApplied)
})
    const data = await res.json()
    console.log(data.results, "data")
     if(!data)console.log("something went wrong", data)
    return data.results
    }catch(err){
        handleError(err,"fetchRequest")
        return []
        
    }
}