import {create} from "zustand"
import type { CategoriesTypeObjArr,ProjectType } from "@renderer/types"
import type { ResultFromBackendType } from "@renderer/subComponents/ProjectForm"
import { supabase } from "@renderer/supabaseClient"
import { session } from "electron"


export type ProjectDataStoreType ={
    projects: ProjectType[] | null,
    setProjects: (projects:ProjectType[] |null)=>void,
    loading:boolean,
    setLoading: (value:boolean)=>void,
    firstTime: boolean,
    setFirstTime:(value:boolean)=>void,
    error: string | null,
    setError: (value: string |null)=>void
}
export const projectDataStore = create<ProjectDataStoreType>((set)=>({
    projects: [], //starting,
    setProjects: (projects: ProjectType[] | null)=>set({projects:projects}),
    loading: true,
    setLoading: (value:boolean)=>set({loading:value}),
    firstTime: true,
    setFirstTime: (value:boolean)=>set({firstTime:value}),
    error: null,
    setError: (value:string|null)=>set({error:value})

}))

export const selectProjects = (state:ProjectDataStoreType)=>state.projects
export const selectSetProjects = (state:ProjectDataStoreType)=>state.setProjects
export const selectLoading = (state:ProjectDataStoreType)=>state.loading
export const selectSetLoading = (state:ProjectDataStoreType)=>state.setLoading
export const selectFirstTime = (state:ProjectDataStoreType)=>state.firstTime
export const selectSetFirstTime = (state:ProjectDataStoreType)=>state.setFirstTime
export const selectError = (state:ProjectDataStoreType)=>state.error
export const selectSetError = (state:ProjectDataStoreType)=>state.setError
export type WarningStoreType ={
    warning: boolean,
    setWarning:()=>void
}

export const warningStore = create<WarningStoreType>((set)=>({
    warning:false,
    setWarning:()=>set((state)=>({warning: !state.warning}))
}))

export type FormStoreType ={
    selectedOptions: CategoriesTypeObjArr,
    setSelectedOptions: (selectedOptions:CategoriesTypeObjArr)=>void,
    isSuccess: ResultFromBackendType,
    setIsSuccess:(isSuccess:ResultFromBackendType)=>void,
    isNotActive: boolean,
    setIsNotActive: (value:boolean)=>void
}


export const formStore = create<FormStoreType>((set)=>({
     selectedOptions: {},
    setSelectedOptions: (selectedOptions:CategoriesTypeObjArr)=>set(({selectedOptions})),
    isSuccess: {message:"",success:false},
    setIsSuccess:(isSuccess:ResultFromBackendType)=>set({isSuccess}),
    isNotActive: true,
    setIsNotActive: (value:boolean)=>set({isNotActive:value})
}))

export const selectSelectedOptions= (state:FormStoreType)=>state.selectedOptions
export const selectSetSelectedOptions= (state:FormStoreType)=>state.setSelectedOptions
export const selectIsSuccess= (state:FormStoreType)=>state.isSuccess
export const selectSetIsSuccess= (state:FormStoreType)=>state.setIsSuccess
export const selectIsNotActive= (state:FormStoreType)=>state.isNotActive
export const selectSetIsNotActive= (state:FormStoreType)=>state.setIsNotActive

type SupabaseStoreType ={
    session: any | null,
    setSession: (session: any | null) => void;
    userId:string |null,
    userEmail: string 
    setUserEmail :(email:string)=>void,
    authError: string |null,
    setAuthError:  (message:string|null)=>void, 
     initAuth: ()=>void
}

export const supabaseStore = create<SupabaseStoreType>((set)=>{
    let sessionInProgress:boolean = false;
    return{
        session:null,
        setSession: (session:any|null)=>set({session:session}),
        userId:null,
        userEmail: "",
        setUserEmail: (email:string)=>set({userEmail:email}),
        authError:null,
        setAuthError:(error:null|string)=> set({authError:error}),
        initAuth:async()=>{
            try{
                if(sessionInProgress)return
                sessionInProgress = true
                const {data, error} = await supabase.auth.getSession()
                if(error) throw error
                if(!data)throw new Error("Error getting section")
                    set({session:data.session})
            }catch(err){
                console.error(err)
            }finally{
                sessionInProgress = false
            }
            supabase.auth.onAuthStateChange((_event,newSession)=>{
                set({session:newSession,
                    userId:newSession?.user?.id,
                    userEmail:newSession?.user?.email
                });
            });
        }
    }
})

