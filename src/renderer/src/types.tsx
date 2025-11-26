
import { MultiValue } from "react-select"
import type { LanguagesType, FrameWorkType, LibrariesType, } from "./info"
export type CategoriesType = "languages"|"frameworks"|"libraries"
/* explaining map type:
“For every value in this union type, make a property in the object with that key.”

*/
// this creates a generic type that must be a string
export type OptionOf<T extends string> = {
    value: Lowercase<T>;
    label: Capitalize<T>
}
export type CategoriesTypeObjArr ={
    languages?: MultiValue<OptionOf<LanguagesType>>,
    frameworks?: MultiValue<OptionOf<FrameWorkType>>,
    libraries?: MultiValue<OptionOf<LibrariesType>>
}

export type GoalsChecklistType={
   goals: {desc:string, completed:boolean}[]

    
}

    
    

export type ProjectType ={
    id:string,
    name: string,
    description: string,
    categories?: CategoriesTypeObjArr,
    goals_checklist:GoalsChecklistType 
    completed: boolean,

} 

export type ProjectFormSubmitType = Omit<ProjectType,"id">