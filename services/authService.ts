import { auth } from "@/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"

// This service handles authentication operations using Firebase Auth
export const register = (email:string, password:string) => {
    return createUserWithEmailAndPassword(auth, email, password)
}

export const login = (email:string, password:string) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const logout = () => {
    return signOut(auth)
}