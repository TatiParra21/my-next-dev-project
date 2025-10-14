import {create} from "zustand"
import type { CategoriesTypeObjArr,ProjectType } from "@renderer/types"
import type { ResultFromBackendType } from "@renderer/subComponents/ProjectForm"
import { auth } from "@renderer/firebaseClient";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { fetchRequest } from "@renderer/functions/requests";

export type ProjectDataStoreType ={
    projects: ProjectType[] | [],
    setProjects: (projects:ProjectType[] |[])=>void,
    loading:boolean,
    setLoading: (value:boolean)=>void,
    error: string | null,
    setError: (value: string |null)=>void,
    updateProjects: (userId: string)=>Promise<void>
}
export const projectDataStore = create<ProjectDataStoreType>((set)=>({
    projects: [], //starting,
    setProjects: (projects: ProjectType[] | [])=>set({projects:projects}),
    loading: true,
    setLoading: (value:boolean)=>set({loading:value}),
    error: null,
    setError: (value:string|null)=>set({error:value}),
    updateProjects: async(userId: string)=>{
      const projects:ProjectType[] |[] = await fetchRequest(userId)
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

type FirebaseStoreType = {
  user: User | null;
  userId: string | null;
  userEmail: string;
  loading: boolean;
  authError: string | null;
  initAuth: () => void;
  logout: () => Promise<void>;
};

export const firebaseStore = create<FirebaseStoreType>((set) => ({
  user: null,
  userId: null,
  userEmail: "",
  loading: true,
  authError: null,

  // 👇 Replaces supabase.auth.onAuthStateChange()
  initAuth: () => {
    onAuthStateChanged(auth, async(user) => {
      if (user) {
        set({
          user,
          userId: user.uid,
          userEmail: user.email || "",
          loading: false,
        });
         const projects:ProjectType[] | null = await fetchRequest(user.uid)
         projectDataStore.setState({projects:projects})
      } else {
        set({
          user: null,
          userId: null,
          userEmail: "",
          loading: false,
        });
        projectDataStore.setState({projects:[]})
      }
    });
  },

  // 👇 Replaces supabase.auth.signOut()
  logout: async () => {
    try {
      await signOut(auth);
      set({ user: null, userId: null, userEmail: "" });
    } catch (err: any) {
      set({ authError: err.message });
    }
  },
}));

// --- Optional selectors (for cleaner imports)
export const selectUser = (state: FirebaseStoreType) => state.user;
export const selectUserId = (state: FirebaseStoreType) => state.userId;
export const selectUserEmail = (state: FirebaseStoreType) => state.userEmail;
export const selectFirebaseLoading = (state: FirebaseStoreType) => state.loading;
export const selectInitAuth = (state: FirebaseStoreType) => state.initAuth;
export const selectLogout = (state: FirebaseStoreType) => state.logout;