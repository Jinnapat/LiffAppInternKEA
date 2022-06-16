import { FollowEvent } from "@line/bot-sdk"
import { supabase } from "../utils/supabaseClient"

const addUserToDb = async (event: FollowEvent) => {
    const userData = await supabase.from("users").select().eq("userId", event.source.userId)
    if (userData.body?.length == 0) {
        const { data, error } = await supabase.from('users').insert([{
            userId: event.source.userId
        }])
    }
}

export default addUserToDb