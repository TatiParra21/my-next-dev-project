
import React, { useEffect } from 'react'
import { SectionNotReady } from './components/SectionNotReady'
import { Layout } from './components/Layout'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { SubLayout } from './components/SubLayout'
import { ProjectSelectionBase } from './components/ProjectSelectionBase'
import { AddNewProject } from './components/AddNewProject'
import { ProjectBaseEdit } from './subComponents/ProjectBaseEdit'
import { LoginForm } from './components/LoginForm'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoggedInRoute } from './components/LoggedInRoute'
import { firebaseStore, selectInitAuth, } from './store/projectStore'

const router =createBrowserRouter([
   {path:"/", element:<LoggedInRoute><LoginForm/> </LoggedInRoute> , errorElement:<SectionNotReady/>},
   
  // { path: "/auth/callback", element: <AuthCallback /> },
   {path:"/sign-in", element: <LoggedInRoute> <LoginForm/> </LoggedInRoute>, errorElement:<SectionNotReady/>},
  {path:"/dashboard", element: <ProtectedRoute><Layout/></ProtectedRoute>,
    children:[
      {path:"project-ideas", element:<SubLayout/>, errorElement:<SectionNotReady/>, 
        children:[
          {index:true,element:<ProjectSelectionBase/>},
          {path:":id",element:<ProjectBaseEdit/>}

        ]
      },
      {path:"write-new-project", element:<AddNewProject/>}
    ]
  }
])
function App(): React.JSX.Element {
 const initAuth = firebaseStore(selectInitAuth)
 useEffect(()=>{
  initAuth()
 },[])

  return (
    <>
    
     <RouterProvider router={router}/>

     
    </>
  )
}

export default App
