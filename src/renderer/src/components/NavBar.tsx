import { NavLink } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { JSX } from "react"

//import { formStore } from "@renderer/store/projectStore"
export const NavBar =(): JSX.Element=>{
    const styleNav =(isActive :boolean): string=>{
        const chosenStyle: string = isActive ?  "active-style" : "non-active"
        return chosenStyle
    } 
  
    const location = useLocation()
    const state = location?.state
   const save = state?.save
    return(<>
    {/* <p>{`Current state: ${save ?? "none"}`}</p> */}
    <nav className="navigation">
        <NavLink state={{save: state?.save, } } to={"project-ideas"} end className={({isActive})=>styleNav(isActive)} >Current Projects</NavLink>
        {save && <NavLink state={{save: state?.save }} to={`${save}`}className={({isActive})=>styleNav(isActive)}>Home</NavLink> }
        
        <NavLink state={{save: state?.save}} to="write-new-project" className={({isActive})=>styleNav(isActive)} >Write new Project Idea</NavLink>
    </nav>
    </>
    )
}