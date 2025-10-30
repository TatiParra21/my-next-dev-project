import { JSX } from "react"
import Select from 'react-select'
import type { OptionComponentProps } from "../components/FormComponents/ProjectForm";
import type { CategoriesType } from "@renderer/types";
import type { AllCategoriesType } from "@renderer/info";
import { MultiValue } from 'react-select';
import { OptionOf } from "@renderer/types";
import { categories } from "@renderer/info";
export type SelectProps={
    values:MultiValue<OptionOf<AllCategoriesType>>,
    options:MultiValue<OptionOf<AllCategoriesType>>,
    onChange: (category:string, values:MultiValue<OptionOf<AllCategoriesType>>) => void;
    category: CategoriesType,
}
 const capitalizeFirstLetter =(value: string):string=>{
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
export const ReactSelectComp =(mainProps:SelectProps):JSX.Element=>{
    const {onChange,category,options, values} = mainProps
     
        return(
            <>  
                <Select  key={category} isMulti onChange={(choice)=>onChange(category,choice)} value={values} className="input-class"  options={options}/>
            </>
        )
}
export const OptionComponents =({onChange,initialValues}:OptionComponentProps):JSX.Element=>{
    const allReactSelectComponents :JSX.Element[] = Object.entries(categories).map(([category, options])=>{ 
        return <div className="category-class" key={category}>
                    <label>{capitalizeFirstLetter(category)}:</label>
                    <ReactSelectComp values={initialValues?.[category as CategoriesType]?? []} 
                    onChange={onChange} options={options} category={category as CategoriesType} />
                </div>
    })
    return(
        <>
            {allReactSelectComponents}
        </>
    )  
}