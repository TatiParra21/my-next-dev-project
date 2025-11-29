
import type { OptionOf } from "@renderer/types"
import type { ProjectType } from "@renderer/types"
import type { AllCategoriesType } from "@renderer/info"
import { MultiValue } from "react-select"
import type {  CategoriesTypeObjArr } from "@renderer/types"
import { OptionComponents } from "../../subComponents/OptionsComponents"
import { FormEvent, JSX } from "react"
import { projectDataStore,selectIsNotActive, selectSetIsNotActive, } from "@renderer/store/projectStore"
import { formStore } from "@renderer/store/projectStore"
import { useState } from "react"
import { FormElement } from "./FormElement"
import { ResultFromBackendType } from "./ProjectForm"
import { fetchFilteredRequest } from "@renderer/functions/requests"
type ProjectFilterSubmitType ={
   categories: CategoriesTypeObjArr,
   completed:boolean,
}
export const FilterTab=():JSX.Element=>{
    const projects = projectDataStore(state=>state.projects)
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const [selectedFilters, setSelectedFilters] = useState<CategoriesTypeObjArr>({})
    const [resultFromBackend,setResultFromBackend] = useState<ResultFromBackendType>({message:"",success:false})
    const showFilterTab =():void=>{
        setShowFilter(prev=>!prev)
    }
    if(!projects){
        return <div>...Loading from filter</div>
    }

    const isNotActive = formStore(selectIsNotActive)
    const setIsNotActive = formStore(selectSetIsNotActive)

    const changeActive =():void=>{
        setIsNotActive(false)
        setResultFromBackend({...resultFromBackend, success:false})
    } 
    const handleCategoryChoices =(category:string,values:MultiValue<OptionOf<AllCategoriesType>>):void=>{
        if(isNotActive) setIsNotActive(false)     
        const categoryVal :string = category.toLowerCase()
        setSelectedFilters({...selectedFilters, [categoryVal]:values})  
    }
    const filterProjects=async(e: FormEvent<HTMLFormElement>):Promise<void>=>{
        e.preventDefault()
        const form = e.currentTarget
        const formData :FormData = new FormData(form)
        const isCompleted :boolean = formData.get("is-completed") === "on"
        console.log(isCompleted, "fooor", selectedFilters)
         const filtersChosen :ProjectFilterSubmitType ={                    
                        categories: selectedFilters,
                        completed:isCompleted,         
                    }
         const resultFromBackend :ResultFromBackendType |null | ProjectType[] = await fetchFilteredRequest( filtersChosen)
         console.log(resultFromBackend, "result from filter")
    }       
    return(
        <form onSubmit={filterProjects} className="">
          <button onClick={showFilterTab}>Filter</button>
          {showFilter && <> 
          <OptionComponents initialValues={selectedFilters}  onChange={handleCategoryChoices}/>
           <FormElement changeActive={changeActive} name="is-completed" classAssigned="row check-box-sec" type="checkbox">
                Completed
            </FormElement>
          <button disabled={isNotActive} className="submit-btn" type="submit">Search</button>
          
           </>}
        </form>
    )
}

