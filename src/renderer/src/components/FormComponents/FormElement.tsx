
import { JSX } from "react";
type FormElementType ={
    changeActive: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>void,   
    name:string,
    classAssigned:string
    children: React.ReactNode,   
}& React.InputHTMLAttributes<HTMLInputElement>  & React.TextareaHTMLAttributes<HTMLTextAreaElement>
export const FormElement =({changeActive, name, children,classAssigned, ...props}:FormElementType):JSX.Element=>{

    return(
        <div className={`flex ${classAssigned}`}>
            <label  htmlFor={name}>{children}</label>
            {name == "project-description" ?
            <textarea onChange={changeActive}  {...props} id={name} name={name}></textarea> :
            name =="project-name" ? <input id={name} {...props} name={name} /> :
            <input onChange={changeActive}  id={name} {...props} name={name} />
             }
        </div>
               
)
}