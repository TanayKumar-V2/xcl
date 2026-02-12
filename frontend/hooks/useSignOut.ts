import { useClerk } from "@clerk/clerk-expo"
import { Alert } from "react-native"


export const useSignOut=()=>{
    const{signOut}=useClerk()

    const handleSignOut=()=>{
        Alert.alert("Alert","Are you sure you want to log out?",[
            {text:"cancel", style:"cancel"},
            {
                text:"logout",
                style:"destructive",
                onPress:()=>signOut()
            }
        ])
    }

    return {handleSignOut}
}