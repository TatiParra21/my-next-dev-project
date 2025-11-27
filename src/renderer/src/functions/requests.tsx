import type { ProjectFormSubmitType, ProjectType } from "@renderer/types"
import { handleError } from "./handleError"
import { ResultFromBackendType} from "@renderer/components/FormComponents/ProjectForm"
import { CategoriesTypeObjArr } from "@renderer/types"
import { GoalsChecklistType } from "@renderer/types"


const getAuthToken = async(): Promise<string | null> => {
  const token = await window.secureAuth.getToken();
  console.log("tokeb in re", token)
  if (!token) {
    console.warn("⚠️ No saved Google token found.");
    return null;
  }
  return token;
};
const api = async <T,>( url: string, options: RequestInit = {}, requestName:string): Promise<T | null> => {
  const token = await getAuthToken();
  if (!token) return null; // this line was fine
  try{
    const res = await fetch(`https://my-next-dev-project.onrender.com${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      // This spreads any headers the caller passed (important!)
      ...(options.headers ?? {}),
    },
  });
  if (!res.ok) {
    console.error("API error", res.status, await res.text());
    return null;
  }
  return (await res.json()) as T;
  }catch(err){
    handleError(err, requestName);
    return null;
  } 
};

const fetchRequest =async():Promise<ProjectType[]>=>{
    await api<ProjectType[]>()}

/*
export const fetchRequest =async():Promise<ProjectType[]>=>{
    try{         
      const token = await getAuthToken();
        if (!token) return [];
         const res = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas`,{
            headers:{
                "Authorization": `Bearer ${token}`
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
} */
export const postRequest = async(body: Array<ProjectFormSubmitType>):Promise<ResultFromBackendType |null>=>{
     const token = await getAuthToken();
        if (!token) return null;
    try{
        const response = await fetch(`https://my-next-dev-project.onrender.com/database/write-new-project`,{
    method:"POST",
    headers:{
         "Authorization": `Bearer ${token}`,
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
export const patchRequest = async(id:string, body:Record<string, unknown>):Promise<ResultFromBackendType |null>=>{
    try{ 
     const token = await getAuthToken();
        if (!token) return  null;
        console.log(body, "body")
    const response = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas/${id}/edit`,{
        method:"PATCH",
        headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`,    
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
export const patchGoalsRequest = async(id:string, body:GoalsChecklistType):Promise<ResultFromBackendType |null>=>{
    try{ 
     const token = await getAuthToken();
        if (!token) return  null;
        console.log(body, "body goals")
    const response = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas/${id}/goals`,{
        method:"PATCH",
        headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`,    
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
        const token = await getAuthToken();
        if (!token) return  null;
        const res = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas/${id}`,
            {method: "DELETE",
                headers:{
                "Authorization": `Bearer ${token}`
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
    const token = await getAuthToken();
        if (!token) return [];
          const res = await fetch(`https://my-next-dev-project.onrender.com/database/project-ideas/filter`,{
        method:"GET",
        headers:{
        "Content-Type":"application/json",
        "Authorization": `Bearer ${token}`,
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

