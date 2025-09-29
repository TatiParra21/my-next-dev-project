
import { JSX } from "react"
import { NavLink } from "react-router-dom"
export const SectionNotReady =(): JSX.Element=>{
    return(
        <>
            <h1>Not ready</h1>
              <NavLink to=".."
                relative="path" >go back</NavLink>
        </>
    )
}