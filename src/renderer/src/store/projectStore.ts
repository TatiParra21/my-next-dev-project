import {create} from "zustand"
import type { CategoriesTypeObjArr,ProjectType } from "@renderer/types"
import type { ResultFromBackendType } from "@renderer/components/FormComponents/ProjectForm"

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
  user: GoogleUser | null;
  token: string | null;
  loading: boolean;
  authError: string | null;
  login: () => void;
  handleRedirect: (url: string) => Promise<void>;
  initAuth: () => Promise<void>; // ✅ added
  logout: () => void;
};

export const googleAuthStore = create<GoogleAuthStoreType>((set) => ({
  user: null,
  token: null,
  loading: true, // start as loading until we check localStorage
  authError: null,

  // 🔹 Opens browser for Google sign-in (via backend)
  login: () => {
    window.electron.openExternal(
      "https://my-next-dev-project.onrender.com/auth/google"
    );
  },

  // 🔹 Handles redirect from Google → deep link
  handleRedirect: async (url: string) => {
    const token = new URL(url).searchParams.get("token");
    if (!token) {
      set({ authError: "No token found in redirect URL." });
      return;
    }

    try {
      const { data } = await axios.post(
        "https://my-next-dev-project.onrender.com/verify-token",
        { token }
      );

      set({
        token,
        user: data.user,
        authError: null,
      });

      localStorage.setItem("google_token", token);
    } catch (err: any) {
      console.error("Redirect handling error:", err);
      set({ authError: err.message });
    }
  },

  // 🔹 Runs once on app start — restores saved token if present
  initAuth: async () => {
    const savedToken = localStorage.getItem("google_token");
    if (!savedToken) {
      set({ loading: false });
      return;
    }

    try {
      const { data } = await axios.post(
        "https://my-next-dev-project.onrender.com/verify-token",
        { token: savedToken }
      );

      set({
        user: data.user,
        token: savedToken,
        loading: false,
        authError: null,
      });
    } catch (err: any) {
      console.error("Token verification failed:", err.message);
      localStorage.removeItem("google_token");
      set({
        user: null,
        token: null,
        loading: false,
        authError: "Session expired. Please log in again.",
      });
    }
  },

  // 🔹 Log out completely
  logout: () => {
    localStorage.removeItem("google_token");
    set({ user: null, token: null });
  },
}));


export const selectUser = (state: GoogleAuthStoreType) => state.user;
export const selectUserEmail = (state: GoogleAuthStoreType) => state.user?.email || "";
export const selectAuthLoading = (state: GoogleAuthStoreType) => state.loading;
export const selectLogout = (state: GoogleAuthStoreType) => state.logout;
export const selectInitAuth = (state: GoogleAuthStoreType) => state.initAuth;