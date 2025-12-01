import {  FormEvent,useState } from "react"
import type { OptionOf, ProjectType, CategoriesTypeObjArr, ProjectFormSubmitType } from "@renderer/types"
import { useLocation } from "react-router-dom"
import type { AllCategoriesType } from "@renderer/info"
import { MultiValue } from "react-select"

import { projectDataStore,
    formStore, 
    selectIsNotActive, 
    selectSetIsNotActive,  
    selectUpdateProjects,
    googleAuthStore,
    selectAuthLoading,
    } from "@renderer/store/projectStore"
type GoalsArray = {desc:string, completed:boolean}[]
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

export type UseFormReturnType ={
    loading: boolean;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
    changeActive: () => void;
    selectedOptions: CategoriesTypeObjArr;
    handleCategoryChoices: (category: string, values: MultiValue<OptionOf<AllCategoriesType>>) => void;
    initialValues: ProjectFormSubmitType |undefined;
    newGoals: GoalsArray | undefined;
    updateGoals: (goals: GoalsArray) => void;
    isNotActive: boolean;
    resultFromBackend: ResultFromBackendType;
}

export const useReturnForm =(form:ProjectFormType):UseFormReturnType=>{
    const {initialValues, onSubmit} :ProjectFormType = form
    const location= useLocation()
    const [newGoals,setNewGoals] = useState<GoalsArray | undefined>(initialValues?.goals_checklist.goals)
    const [selectedOptions, setSelectedOptions] = useState<CategoriesTypeObjArr>(initialValues &&initialValues.categories ? initialValues.categories : {})
   
    const [resultFromBackend,setResultFromBackend] = useState<ResultFromBackendType>({message:"",success:false})
    const isNotActive  = formStore(selectIsNotActive)
    const  setIsNotActive  = formStore(selectSetIsNotActive)
    const updateProjects = projectDataStore(selectUpdateProjects)
    const loading = googleAuthStore(selectAuthLoading)
    //const userTest = googleAuthStore(selectUser)
    
/*
    useEffect(()=>{ 
        if(initialValues && initialValues.categories){
            setSelectedOptions(initialValues.categories)
        }else{
            setSelectedOptions({})
        }
            //console.log(location.state, "FROm")
    },[initialValues,setSelectedOptions]) */
    const changeActive =():void=>{
        setIsNotActive(false)
       setResultFromBackend({...resultFromBackend, success:false})
    }
        const handleCategoryChoices =(category:string,values:MultiValue<OptionOf<AllCategoriesType>>):void=>{
           if(isNotActive) setIsNotActive(false)
            const categoryVal :string = category.toLowerCase()
            setSelectedOptions({...selectedOptions, [categoryVal]:values})  
            setResultFromBackend({message:"",success:false})
        }
         const updateGoals =(goals:GoalsArray):void=>{
            if(goals !== newGoals){
                 if(isNotActive) setIsNotActive(false)
                    setResultFromBackend({message:"",success:false})
            }
            
            setNewGoals(goals)      
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
                goals_checklist:newGoals ? {goals:newGoals}: {goals:[]},
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
        return {loading,
            handleSubmit,
            changeActive,
            selectedOptions,
            handleCategoryChoices,
            initialValues, 
            newGoals,
            updateGoals,
            isNotActive,
            resultFromBackend}
}