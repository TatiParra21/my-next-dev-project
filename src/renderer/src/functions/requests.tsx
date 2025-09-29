import type { ProjectFormSubmitType, ProjectType } from "@renderer/types"
import { handleError } from "./handleError"
import { ResultFromBackendType} from "@renderer/subComponents/ProjectForm"
export const fetchRequest =async(user_id:string):Promise<ProjectType[] | null>=>{
    try{
         const res = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas?user=${encodeURIComponent(user_id)}`)
     if (!res.ok) {
      console.error("Fetch failed with status", res.status);
      return null;
    }
const data = await res.json();
    console.log(data, "data from backend");

    if (!data.results) return []; // user may have 0 projects
    return data.results;
   
    }catch(err){
        handleError(err,"fetchRequest")
        return null
        
    }
}
export const postRequest = async(body: Array<ProjectFormSubmitType>):Promise<ResultFromBackendType |null>=>{
    console.log(body, "the body")
    try{
        const response = await fetch(`https://my-next-dev-project.onrender.com/database/write-new-project`,{
    method:"POST",
    headers:{
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

export const patchRequest = async(id:string,user_id:string, body:Record<string,any>):Promise<ResultFromBackendType |null>=>{
    try{
        console.log(body, "body")
    const response = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas/${id}/edit?user=${encodeURIComponent(user_id)}`,{
        method:"PATCH",
        headers:{
        "Content-Type":"application/json"
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
export const deleteRequest =async(id:string, user_id:string):Promise<void |null>=>{
    try{
        const res = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas/${id}?user=${encodeURIComponent(user_id)}`,
            {method: "DELETE"
        })
        const data = await res.json()
         console.log("Project was deleted")
        return data
    }catch(err){
         handleError(err,"deleteRequest")
        return null
    }
}

export const fetchFilteredRequest =async():Promise<ProjectType[] | null>=>{
    try{
         const res = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas`)
    const data = await res.json()
    console.log(data.results, "data")
     if(!data)console.log("something went wrong", data)
    return data.results
    }catch(err){
        handleError(err,"fetchRequest")
        return null
        
    }
}