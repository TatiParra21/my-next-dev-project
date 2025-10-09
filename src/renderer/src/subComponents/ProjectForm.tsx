import {  FormEvent, JSX, useEffect } from "react"
import type { OptionOf, ProjectType, CategoriesTypeObjArr, ProjectFormSubmitType } from "@renderer/types"
import { useLocation } from "react-router-dom"
import type { AllCategoriesType } from "@renderer/info"
import { MultiValue } from "react-select"
import { OptionComponents } from "./OptionsComponents"
import { projectDataStore,
    firebaseStore,
    formStore, 
    selectIsNotActive, 
    selectIsSuccess, 
    selectSelectedOptions, 
    selectSetFirstTime, 
    selectSetIsNotActive, 
    selectSetIsSuccess, 
    selectSetSelectedOptions, 
    selectUserId} from "@renderer/store/projectStore"
import { FormElement } from "./FormElement"
export const capitalizeFirstLetter =(value: string):string=>{
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
export type OptionComponentProps={
    initialValues?: CategoriesTypeObjArr, 
    onChange: (category:string,values: MultiValue<OptionOf<AllCategoriesType>>) => void,
}
export type ResultFromBackendType ={
    message: string,
    success:boolean,
    result?: ProjectType[]
}
export type ProjectFormType ={
    initialValues?: ProjectFormSubmitType,
    onSubmit: (projectData: Array<ProjectFormSubmitType>) => Promise<ResultFromBackendType |null>
}
export const ProjectForm=(form:ProjectFormType):JSX.Element=>{
    const setFirstTime = projectDataStore(selectSetFirstTime)
    const {initialValues, onSubmit} :ProjectFormType = form
    const location= useLocation()
    const selectedOptions = formStore(selectSelectedOptions)
    const setSelectedOptions  = formStore(selectSetSelectedOptions)
    const isSuccess  = formStore(selectIsSuccess)
    const setIsSuccess  = formStore(selectSetIsSuccess)
    const isNotActive  = formStore(selectIsNotActive)
    const  setIsNotActive  = formStore(selectSetIsNotActive)
    const userId = firebaseStore(selectUserId)
    useEffect(()=>{ 
        if(initialValues && initialValues.categories){
            setSelectedOptions(initialValues.categories)
        }else{
            setSelectedOptions({})
        }
            console.log(location.state, "FROm")
    },[])
    const changeActive =():void=>{
        setIsNotActive(false)
        setIsSuccess({...isSuccess, success:false})
    }
        const handleCategoryChoices =(category:string,values:MultiValue<OptionOf<AllCategoriesType>>):void=>{
           if(isNotActive) setIsNotActive(false)
            console.log(initialValues, "init")
            const categoryVal :string = category.toLowerCase()
            setSelectedOptions({...selectedOptions, [categoryVal]:values})  
        }
        const handleSubmit=async(event: FormEvent<HTMLFormElement>): Promise<void>=>{
           // console.log(initialValues, "init")
            event.preventDefault()
            const formEl = event.currentTarget
            const formData :FormData = new FormData(formEl)
             const isCompleted :boolean = formData.get("is-completed") === "on"
            const projectDescription = formData.get("project-description")
            const projectName = formData.get("project-name")
           if(typeof projectName !== "string" || typeof projectDescription !== "string"){
                throw new Error("No project name")
           }
            const projectFormInfo : ProjectFormSubmitType={
                name: projectName,
                description: projectDescription,
                categories: selectedOptions,
                completed:isCompleted,
                user_id: userId!
            }
        const resultFromBackend :ResultFromBackendType |null = await onSubmit([projectFormInfo])

            if(resultFromBackend)
        if( resultFromBackend.success && location.pathname == "/write-new-project"){
            formEl.reset()
            console.log("passed")
            setSelectedOptions({})
              setIsSuccess(resultFromBackend )
            setFirstTime(true)
             
        }else if(resultFromBackend.success){
            setFirstTime(true)
            setIsSuccess({...isSuccess, success: true} )
            setIsNotActive(true)
            
            }else if(resultFromBackend.message &&!resultFromBackend.success ){
                setIsSuccess({message: resultFromBackend.message , success: false})
            }
            
        }
        
    return(
        <form className="flex colum" onSubmit={handleSubmit}>
            <FormElement changeActive={changeActive}   name="project-name" classAssigned="colum" type="text" placeholder="My New Project" defaultValue={initialValues?.name ?? ""} required>
                Project Name:
            </FormElement>
             <OptionComponents  initialValues={selectedOptions} onChange={handleCategoryChoices}/>
             <FormElement changeActive={changeActive} name="project-description" classAssigned="colum" defaultValue={initialValues?.description ?? ""}>
                Project Description:
            </FormElement>
            <FormElement changeActive={changeActive} name="is-completed" classAssigned="row check-box-sec" type="checkbox" defaultChecked={initialValues?.completed ?? false}>
                Completed
            </FormElement>
            <button disabled={isNotActive} className="submit-btn" type="submit">Submit</button>
            {isSuccess.message && <p>{isSuccess.message}</p> }
        </form>
    )
}