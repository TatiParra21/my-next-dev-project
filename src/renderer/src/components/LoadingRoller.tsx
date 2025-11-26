import { JSX } from "react"

export const LoadingRoller =():JSX.Element=>{
    console.log("loaidng roller was rendered")
    return(
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>)
}