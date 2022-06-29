import { FollowEvent } from "@line/bot-sdk"
import { PostgrestResponse } from "@supabase/supabase-js"
import { supabase } from "../utils/supabaseClient"

interface UserInfoResponse {
    userId: string
}

const handleUserFollow = (event: FollowEvent) => {

    const handleLoadUserInfoSucceed = (value: PostgrestResponse<UserInfoResponse>) => {
        if (value.data?.length == 0) {
            supabase.from("users").insert({
                userId: event.source.userId,
                status: "free"
            }).then(() => {
                console.log("created a user")
            }, (reason) => {
                console.log("cant create user")
                console.log(reason)
            })
        }
    }
    
    const handleLoadUserInfoFailed = (reason: any) => {
        console.log("cant get user from db")
        console.log(reason)
    }

    supabase.from("users").select("userId").eq("userId", event.source.userId)
    .then(handleLoadUserInfoSucceed, handleLoadUserInfoFailed)
}

export default handleUserFollow