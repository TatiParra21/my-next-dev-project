
import { CategoriesTypeObjArr } from "@renderer/types"
export type CompareFormsType = {
    original: {    
        name: string,
        description: string,
        categories?: CategoriesTypeObjArr,
        completed:boolean
    }
    updated: {
        name: string,
        description: string,
        categories?: CategoriesTypeObjArr,
        completed:boolean}
    }
export type CompareResults ={
        name?: string,
        description?: string,
        categories?: CategoriesTypeObjArr,
        completed: boolean, 
    }
export const compareForms=({original,updated}:CompareFormsType):CompareResults=>{
    const updatedData :CompareResults ={completed: updated.completed ?? original.completed}
    const isSameName : boolean= original.name == updated.name
    if(!isSameName) updatedData.name = updated.name
    const isSameDescription : boolean= original.description == updated.description
    if(!isSameDescription) updatedData.description = updated.description
     const keys: (keyof CategoriesTypeObjArr)[] = ["languages", "frameworks", "libraries"];
   keys.forEach((key:keyof CategoriesTypeObjArr)=>{
    const originalValues :string = original?.categories?.[key]?.map(val=>val.value).sort().join(" ") ?? ""
    const updatedValues :string = updated?.categories?.[key]?.map(val=>val.value).sort().join(" ") ?? ""
    if(originalValues !== updatedValues) {
         if (!updatedData.categories) updatedData.categories = {};
       updatedData.categories[key] = updated.categories?.[key]
        }else{
            if (!updatedData.categories) updatedData.categories = {};
             updatedData.categories[key] = original.categories?.[key]
        }
   })
   return updatedData
}