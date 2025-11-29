import {  JSX,useRef} from "react"
import type { OptionOf, ProjectType, CategoriesTypeObjArr, ProjectFormSubmitType } from "@renderer/types"
import type { AllCategoriesType } from "@renderer/info"
import { MultiValue } from "react-select"
import { OptionComponents } from "../../subComponents/OptionsComponents"
import { FormElement } from "./FormElement"
import { LoadingRoller } from "../LoadingRoller"
import { AddGoalsDiv } from "@renderer/subComponents/AddGoalsDiv"
import {type  UseFormReturnType,  useReturnForm } from "@renderer/functions/useReturnForm"
import { useScrollToComponent } from "@renderer/functions/useScrollToComponent"
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
    const {loading,handleSubmit,changeActive,selectedOptions,
        handleCategoryChoices,initialValues, newGoals,
        updateGoals,isNotActive,
        resultFromBackend}:UseFormReturnType = useReturnForm(form)
        console.log("loading??",loading)
        const messageRef = useRef<HTMLParagraphElement | null>(null)
        useScrollToComponent(messageRef,resultFromBackend.message)
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
           <AddGoalsDiv source="project-form" goals={newGoals ?? []} editFunc={updateGoals}/>
            <button disabled={isNotActive} className="submit-btn" type="submit">Submit</button>
            {resultFromBackend.message && <p ref={messageRef}>{resultFromBackend.message}</p> }
        </form>
    )
}












































