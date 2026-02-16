import { useApiClient, userApi } from "@/utils/api"
import { useAuth } from "@clerk/clerk-expo"
import { useMutation } from "@tanstack/react-query"
import { useEffect } from "react"

export const useUserSync=()=>{
    const{isSignedIn}=useAuth()
    const api=useApiClient()

    const syncUserMutation=useMutation({
        mutationFn:()=>userApi.syncUser(api),
        onSuccess:(response:any)=>console.log("User synced successfully:", response.data.user),
        onError:(error)=>console.error("User sync failed:",error)
    })

    useEffect(()=>{
        // 1. Removed the .data check
        // 2. Added () to mutate
        if(isSignedIn && !syncUserMutation.isPending){
            syncUserMutation.mutate()
        }
    },[isSignedIn])

    return null
}