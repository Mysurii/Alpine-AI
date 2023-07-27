import { AxiosError } from "axios";
import { ILoginUser, IUser } from "../types/user.type";
import { SuccessLogout } from "../types/apiresponse.type";
import { create } from "zustand";
import { loginUser, verifyUser } from "../services/auth";
import { router } from "../pages/router";
import toast from "react-hot-toast";
import { request } from "../services/request";

interface AuthState {
  user: IUser | null
  error: AxiosError | null
  verifyUser: ( verificationCode: string ) => Promise<boolean>
  setErrorMessage: ( message: string | null ) => void
  setError: ( error: AxiosError | null ) => void
  setUser: ( user: IUser ) => void
  loginUser: ( user: ILoginUser ) => Promise<IUser | undefined>
  logoutUser: () => Promise<SuccessLogout | undefined>
}

const useAuthStore = create<AuthState>( ( set, get ) => ( {
  user: null,
  error: null,
  verifyUser: async ( verificationCode: string ) => {
    try {
      await verifyUser( verificationCode )
      return true
    } catch ( err: unknown ) {
      return false
    }
  },
  setErrorMessage: ( message: string | null ) => set( ( state ) => ( { ...state, errorMessage: message } ) ),
  setError: ( error: AxiosError | null ) => set( ( state ) => ( { ...state, error } ) ),
  setUser: ( user: IUser ) => set( ( state ) => ( { ...state, user } ) ),
  loginUser: async ( user: ILoginUser ) => {
    try {
      const userData = await loginUser( user )
      set( ( state ) => ( { ...state, user: userData } ) )
      return userData
    } catch ( err: any ) {
      get().setError( err )
      return undefined
    }
  },
  logoutUser: async () => {
    localStorage.removeItem( 'token' )
    router.navigate( '/login' )
    toast.success( 'Successfully logged out!' )
    try {
      set( ( state ) => ( { ...state, user: null } ) )
      const res = await request<undefined, SuccessLogout>( 'POST', 'logout' )
      return res.data
    } catch ( err: any ) {
      get().setError( err )
      return undefined
    }
  },
} ) )

export default useAuthStore
