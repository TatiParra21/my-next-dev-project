import {  FormEvent } from "react"
import type { OptionOf, ProjectType } from "@renderer/types"
import { useLocation } from "react-router-dom"
import type { AllCategoriesType } from "@renderer/info"
import type { ProjectFormSubmitType } from "@renderer/types"
import { MultiValue } from "react-select"
import type {  CategoriesTypeObjArr } from "@renderer/types"
import { OptionComponents } from "./OptionsComponents"
import { JSX } from "react"
import { projectDataStore } from "@renderer/store/projectStore"
import type { ProjectDataStoreType } from "@renderer/store/projectStore"
import { FormElement } from "./FormElement"
import { formStore } from "@renderer/store/projectStore"
import type { FormStoreType } from "@renderer/store/projectStore"
import { useEffect, useState } from "react"
import { ProjectFormType } from "./ProjectForm"
import { ResultFromBackendType } from "./ProjectForm"
type ProjectFilterSubmitType ={
    initialValues?: CategoriesTypeObjArr,
    onSubmit: (conditions:CategoriesTypeObjArr) => Promise<ProjectType[] | null>
}
export const FilterTab=(form:ProjectFilterSubmitType):JSX.Element=>{
    const {projects,setFirstTime}:ProjectDataStoreType = projectDataStore(state=>state)
    const [showFilter, setShowFilter] = useState<boolean>(false)
    
    const showFilterTab =()=>{
        setShowFilter(prev=>!prev)
    }
    if(!projects){
        return <div>...Loading</div>
    }

    const giveSelectedOptions =()=>[
        console.log(selectedOptions)
    ]
const { onSubmit} :ProjectFilterSubmitType = form
    const location= useLocation()
    const {selectedOptions, setSelectedOptions,isSuccess, setIsSuccess,isNotActive, setIsNotActive}:FormStoreType = formStore(state=>state)
    //console.log(isSuccess, "issSSucces")


    const changeActive =():void=>{
        setIsNotActive(false)
        setIsSuccess({...isSuccess, success:false})
    }
        const handleCategoryChoices =(category:string,values:MultiValue<OptionOf<AllCategoriesType>>):void=>{
           if(isNotActive) setIsNotActive(false)
           
            const categoryVal :string = category.toLowerCase()
            setSelectedOptions({...selectedOptions, [categoryVal]:values})  
        }
       
        
    return(
        <div className="">
          <button onClick={showFilterTab}>Filter</button>
          {showFilter && <> 
          <OptionComponents initialValues={selectedOptions}  onChange={handleCategoryChoices}/>
          <button disabled={isNotActive} onClick={giveSelectedOptions} className="submit-btn" type="submit">Search</button>
           </>}
           

        </div>
    )
}