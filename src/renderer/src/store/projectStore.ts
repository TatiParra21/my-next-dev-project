import {create} from "zustand"
import type { CategoriesTypeObjArr,ProjectType } from "@renderer/types"
import type { ResultFromBackendType } from "@renderer/components/FormComponents/ProjectForm"
import { jwtDecode } from "jwt-decode";

import { TokenPayload } from "google-auth-library";

import { fetchRequest } from "@renderer/functions/requests";

export type ProjectDataStoreType ={
    projects: ProjectType[] | [],
    setProjects: (projects:ProjectType[] |[])=>void,
    loading:boolean,
    setLoading: (value:boolean)=>void,
    error: string | null,
    setError: (value: string |null)=>void,
    updateProjects: ()=>Promise<void>
}
export const projectDataStore = create<ProjectDataStoreType>((set)=>({
    projects: [], //starting,
    setProjects: (projects: ProjectType[] | [])=>set({projects:projects}),
    loading: true,
    setLoading: (value:boolean)=>set({loading:value}),
    error: null,
    setError: (value:string|null)=>set({error:value}),
    updateProjects: async()=>{
      const projects:ProjectType[] | [] = await fetchRequest()
         projectDataStore.setState({projects:projects})

    }

}))

export const selectProjects = (state:ProjectDataStoreType)=>state.projects
export const selectSetProjects = (state:ProjectDataStoreType)=>state.setProjects
export const selectLoading = (state:ProjectDataStoreType)=>state.loading
export const selectSetLoading = (state:ProjectDataStoreType)=>state.setLoading
export const selectError = (state:ProjectDataStoreType)=>state.error
export const selectSetError = (state:ProjectDataStoreType)=>state.setError
export const selectUpdateProjects = (state:ProjectDataStoreType)=>state.updateProjects
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
    resultFromBackend: ResultFromBackendType,
    setResultFromBackend:(resultFromBackend:ResultFromBackendType)=>void,
    isNotActive: boolean,
    setIsNotActive: (value:boolean)=>void
}
export const formStore = create<FormStoreType>((set)=>({
     selectedOptions: {},
    setSelectedOptions: (selectedOptions:CategoriesTypeObjArr)=>set(({selectedOptions})),
    resultFromBackend: {message:"",success:false},
    setResultFromBackend:(resultFromBackend:ResultFromBackendType)=>set({resultFromBackend}),
    isNotActive: true,
    setIsNotActive: (value:boolean)=>set({isNotActive:value})
}))
export const selectSelectedOptions= (state:FormStoreType)=>state.selectedOptions
export const selectSetSelectedOptions= (state:FormStoreType)=>state.setSelectedOptions
export const selectResultFromBackend= (state:FormStoreType)=>state.resultFromBackend
export const selectSetResultFromBackend =(state:FormStoreType)=>state.setResultFromBackend
export const selectIsNotActive= (state:FormStoreType)=>state.isNotActive
export const selectSetIsNotActive= (state:FormStoreType)=>state.setIsNotActive

import axios from "axios";

type GoogleUser = {
  id?: string;
  email?: string;
  name?: string;
  picture?: string;
};

type GoogleAuthStoreType = {
  user: GoogleUser | null |any;
  loading: boolean;
  authError: string | null;
   handleRedirect: (url:string)=>Promise<void>;
  initAuth: () => Promise<void>; // ✅ added
  logout: () => Promise<void>;
};

export const googleAuthStore = create<GoogleAuthStoreType>((set) => ({
  user: null,
  loading: true, // start as loading until we check localStorage
  authError: null,
  // 🔹 Opens browser for Google sign-in (via backend)
  handleRedirect:async(url:string)=>{
     set({ loading: true });
       const token = new URL(url).searchParams.get("token");
       if (!token) {
    set({ authError: "No token found in redirect URL.", loading: false });
    return;
  }
       try {
    const { data } = await axios.post(
      "https://my-next-dev-project.onrender.com/verify-token",
      { token }
    );
    if(data.error)throw new Error()
    set({
      user: data.user,
      authError: null,
      loading: false,
    });
    await window.secureAuth.saveToken(token);
    await projectDataStore.getState().updateProjects();
  } catch (err: any) {
    console.error("Redirect handling error:", err);
    set({ authError: err.message, loading: false });
  }
  if (!token) {
    set({ authError: "No token found in redirect URL.", loading: false });
    return;
  }
  },
  // 🔹 Runs once on app start — restores saved token if present
  initAuth: async () => {
    set({ loading: true });
    console.log("it ran")
    const token = await window.secureAuth.getToken();
    console.log(token, "tokken??/")
    if(!token){
      set({loading:false})
      return}
try {
    const { data } = await axios.post(
      "https://my-next-dev-project.onrender.com/verify-token",
      { token }
    );
    console.log(data, "data here")
    set({ user: data.user, loading:false });
        await projectDataStore.getState().updateProjects();
  } catch {
    await window.secureAuth.clearToken();
    set({ user: null,loading:false });
  }
  },

  // 🔹 Log out completely
  logout: async() => {
    await window.secureAuth.clearToken()
    set({ user: null});
    projectDataStore.setState({ projects: [] });
  },
}));


export const selectUser = (state: GoogleAuthStoreType) => state.user;
export const selectUserEmail = (state: GoogleAuthStoreType) => state.user?.email || "";
export const selectAuthLoading = (state: GoogleAuthStoreType) => state.loading;
export const selectLogout = (state: GoogleAuthStoreType) => state.logout;
export const selectInitAuth = (state: GoogleAuthStoreType) => state.initAuth;