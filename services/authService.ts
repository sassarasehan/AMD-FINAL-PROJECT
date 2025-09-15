import { auth } from "@/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth"

export const register = (name:string, email:string, password:string) => {
    return createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Set the display name after successful registration
            return updateProfile(userCredential.user, { displayName: name })
                .then(() => {
                    return userCredential.user; // Return the updated user
                });
        });
}
export const login = (email:string, password:string) => {
    return signInWithEmailAndPassword(auth, email, password)
}

export const logout = () => {
    return signOut(auth)
}