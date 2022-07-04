import { MessageEvent, TextEventMessage } from "@line/bot-sdk"
import { supabase } from "../utils/supabaseClient"
import axios from "axios"
import getNoCommand from './message/getNoCommand'
import { PostgrestResponse } from "@supabase/supabase-js"
import viewPlot from "./message/viewPlot"
import invalidUser from "./message/invalidUser"
import addPlot from "./message/addPlot"
import editPlot from "./message/editPlot"
import cancal from "./message/cancel"

const LINE_API_URL = "https://api.line.me/v2/bot/message/reply"

const headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer {" + process.env.NEXT_PUBLIC_MESSAGE_ACCESS_TOKEN + "}"
}

export interface UserData {
    userId: string,
    plot: Object,
    status: string,
    plot_name: string,
    area: number
}

const getResponse = async (message: TextEventMessage, dbRes: PostgrestResponse<UserData>) => {
    if (dbRes.body == null || dbRes.body.length != 1) return invalidUser()
    if (message.text == "ยกเลิก") return await cancal(dbRes.body[0])
    if (message.text == "เพิ่มแปลง") return await addPlot(dbRes.body[0])
    if (message.text == "แก้ไขแปลง") return await editPlot(dbRes.body[0])
    if (message.text == "ดูแปลง") return await viewPlot(dbRes.body[0])
    return getNoCommand(message.text)
}

const handleMessage = (event: MessageEvent) => {
    if (event.message.type != "text") return

    const message = event.message

    supabase.from("users").select("userId,status,plot,plot_name,area").eq("userId", event.source.userId)
    .then(async (res) => {
        const responseMessage = {
            "replyToken": event.replyToken,
            "messages": await getResponse(message, res)
        }
        axios(LINE_API_URL, {
            method: "post",
            headers: headers,
            data: JSON.stringify(responseMessage)
        }).then(() => {
            console.log("requested a message to be sent")
        }, (reason: any) => {
            console.log(reason)
        })
    }, (reason: any) => {
        console.log("Cant get user data")
        console.log(reason)
    })
    
}

export default handleMessage