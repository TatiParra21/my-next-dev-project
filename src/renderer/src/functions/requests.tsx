import type { ProjectFormSubmitType, ProjectType } from "@renderer/types"
import { handleError } from "./handleError"
import { ResultFromBackendType} from "@renderer/components/FormComponents/ProjectForm"
import { CategoriesTypeObjArr } from "@renderer/types"
import { GoalsChecklistType } from "@renderer/types"

// const getAuthToken = async(): Promise<string | null> => {
//   const token = await window.secureAuth.getToken();
//   console.log("tokeb in re", token)
//   if (!token) {
//     console.warn("⚠️ No saved Google token found.");
//     return null;
//   }
//   return token;
// };
const api = async <T,>( url: string, options: RequestInit = {}, requestName:string): Promise<T | null> => {
  //const token = await getAuthToken();
 // if (!token) return null; // this line was fine
  try{
    const hasBody = options.body || ["POST", "PATCH", "PUT"].includes(options.method || "");
    const res = await fetch(`https://my-next-dev-project.onrender.com${url}`, {
    ...options,
    headers: {
     // Authorization: `Bearer ${token}`,
      ...hasBody ? { "Content-Type": "application/json" } : {},
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

export const fetchRequest =async():Promise<ProjectType[]>=>{
    const data =await api<{results:ProjectType[]}>("/database/project-ideas",{},"fetchRequest") 
    return data?.results ?? []
}
export const postRequest = async(body:Array<ProjectFormSubmitType>):Promise<ResultFromBackendType |null>=>{
    return api<ResultFromBackendType>("/database/write-new-project",{method:"POST", body:JSON.stringify(body)},"postRequest")
}
export const patchRequest = async(id:string,body:Record<string, unknown>):Promise<ResultFromBackendType |null>=>{
    return api<ResultFromBackendType>(`/database/project-ideas/${id}/edit`,{method:"PATCH", body:JSON.stringify(body)},"patchRequest")
}
export const patchGoalsRequest = async(id:string, body:GoalsChecklistType):Promise<ResultFromBackendType |null> =>{
    return api<ResultFromBackendType>(`/database/project-ideas/${id}/goals`,{method:"PATCH", body:JSON.stringify(body)},"patchGoalsRequest")
}
export const deleteRequest = async(id:string):Promise<void | null>=>api<void|null>(`/database/project-ideas/${id}`,{method:"DELETE"},"deleteRequest")
type ProjectFilterSubmitType ={
   categories: CategoriesTypeObjArr,
   completed:boolean,   
}
export const fetchFilteredRequest=async(filtersApplied:ProjectFilterSubmitType):Promise<ResultFromBackendType|null |ProjectType[]>=>{
    const data = await api<ResultFromBackendType>("/database/project-ideas/filter", {method:"GET", body:JSON.stringify(filtersApplied)},"fetchFilteredRequest")
    return data?.result ?? data
}