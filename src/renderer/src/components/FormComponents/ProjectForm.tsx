import {  FormEvent, JSX, useEffect } from "react"
import type { OptionOf, ProjectType, CategoriesTypeObjArr, ProjectFormSubmitType } from "@renderer/types"
import { useLocation } from "react-router-dom"
import type { AllCategoriesType } from "@renderer/info"
import { MultiValue } from "react-select"
import { OptionComponents } from "../../subComponents/OptionsComponents"
import { projectDataStore,
    formStore, 
    selectIsNotActive, 
    selectResultFromBackend, 
    selectSelectedOptions, 
    selectSetIsNotActive, 
    selectSetResultFromBackend, 
    selectSetSelectedOptions, 
    selectUpdateProjects,
    googleAuthStore,
    selectAuthLoading,
    } from "@renderer/store/projectStore"
import { FormElement } from "./FormElement"
import { LoadingRoller } from "../LoadingRoller"

/*
export const capitalizeFirstLetter =(value: string):string=>{
    return value.charAt(0).toUpperCase() + value.slice(1)
  } */
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
    const {initialValues, onSubmit} :ProjectFormType = form
    const location= useLocation()
    const selectedOptions = formStore(selectSelectedOptions)
    const setSelectedOptions  = formStore(selectSetSelectedOptions)
    const resultFromBackend  = formStore(selectResultFromBackend)
    const setResultFromBackend  = formStore(selectSetResultFromBackend)
    const isNotActive  = formStore(selectIsNotActive)
    const  setIsNotActive  = formStore(selectSetIsNotActive)
    const updateProjects = projectDataStore(selectUpdateProjects)
    const loading = googleAuthStore(selectAuthLoading)
    //const userTest = googleAuthStore(selectUser)

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
       setResultFromBackend({...resultFromBackend, success:false})
    }
        const handleCategoryChoices =(category:string,values:MultiValue<OptionOf<AllCategoriesType>>):void=>{
           if(isNotActive) setIsNotActive(false)
            console.log(initialValues, "init")
            const categoryVal :string = category.toLowerCase()
            setSelectedOptions({...selectedOptions, [categoryVal]:values})  
        }
        const handleSubmit=async(event: FormEvent<HTMLFormElement>): Promise<void>=>{
            event.preventDefault()
            const formEl = event.currentTarget
            const formData :FormData = new FormData(formEl)
             const isCompleted :boolean = formData.get("is-completed") === "on"
            const projectDescription = formData.get("project-description")
            const projectName = formData.get("project-name")
            console.log(projectName, "naem")
           if(typeof projectName !== "string" || typeof projectDescription !== "string"){
                throw new Error("No project name")
           }
            const projectFormInfo : ProjectFormSubmitType={
                name: projectName,
                goals_checklist:[],
                description: projectDescription,
                categories: selectedOptions,
                completed:isCompleted,
            }
        const resultFromBackend :ResultFromBackendType |null = await onSubmit([projectFormInfo])
            console.log(resultFromBackend, "back")
             console.log(location.pathname,"path")
            if(resultFromBackend)
               
        if( resultFromBackend.success && location.pathname == "/dashboard/write-new-project"){         
            formEl.reset()
            setSelectedOptions({})
              setResultFromBackend(resultFromBackend )
            updateProjects()          
        }else if(resultFromBackend.success){
            updateProjects()
            setResultFromBackend({...resultFromBackend, success: true} )
            setIsNotActive(true)
            
            }else if(resultFromBackend.message &&!resultFromBackend.success ){
                setResultFromBackend({message: resultFromBackend.message , success: false})
            }       
        } 
        console.log("loading??",loading)
        window.addEventListener("blur", () => console.log("❌ Window blurred"));
        window.addEventListener("focus", () => console.log("✅ Window focused"));
        if(loading)return <LoadingRoller/>
    return(
        <form className="flex colum" onSubmit={handleSubmit}>
          
            <FormElement onClick={()=>{console.log("formw was lcikked")}} changeActive={changeActive}   name="project-name" classAssigned="colum" type="text" placeholder="My New Project" defaultValue={initialValues?.name ?? ""} required>
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
            {resultFromBackend.message && <p>{resultFromBackend.message}</p> }
        </form>
    )
}












































