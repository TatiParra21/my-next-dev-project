
import React, { useEffect, Suspense } from 'react'
import { SectionNotReady } from './components/SectionNotReady'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { SubLayout } from './components/SubLayout'
import { LoginForm } from './components/FormComponents/LoginForm'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoggedInRoute } from './components/LoggedInRoute'
import { firebaseStore, selectInitAuth, } from './store/projectStore'
import { LoadingRoller } from './components/LoadingRoller'
import { DeepLinkListener } from "./components/DeepLinkListener";

const AddNewProject = React.lazy(()=>import('./components/AddNewProject'))
const Layout = React.lazy(()=>import('./components/Layout'))
const ProjectSelectionBase = React.lazy(()=>import('./components/ProjectSelectionBase'))
const ProjectBaseEdit = React.lazy(()=>import('./components/FormComponents/ProjectBaseEdit'))
const router =createBrowserRouter([
   {path:"/", element:<LoggedInRoute><LoginForm/> </LoggedInRoute> , errorElement:<SectionNotReady/>},
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
     <DeepLinkListener />
    <Suspense fallback={<LoadingRoller/>}>
      <RouterProvider router={router}/>
    </Suspense>     
    </>
  )
}
export default App
