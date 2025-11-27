
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
    const fieldsToSend: CompareResults = {completed: updated.completed ?? original.completed}
    
    
    if(original.name !== updated.name) fieldsToSend.name = updated.name
   
    if(original.description !== updated.description) fieldsToSend.description = updated.description
if(JSON.stringify(updated.categories !== original.categories)) fieldsToSend.categories = updated.categories
   return fieldsToSend
}