
import { JSX } from "react"
export const RouteShown =({route}: {route:string}): JSX.Element=>{
    return (
        <>
            <p>{` Current Route: ${route}`}</p>
        </>
    )
}