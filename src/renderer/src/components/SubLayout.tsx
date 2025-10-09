
import { Outlet } from "react-router-dom"

import { JSX } from "react";
export const SubLayout =(): JSX.Element=>{
    return(
        <div className="flex colum">
            <Outlet/>  
        </div>
            
        
    )

}