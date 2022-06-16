import type { MessageEvent } from "@line/bot-sdk/lib/types"
import { supabase } from "../utils/supabaseClient"

const LINE_REPLY_API = 'https://api.line.me/v2/bot/message/reply'

const sendResponse = (responseBody: any) => {
    fetch(LINE_REPLY_API, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {' + process.env.MESSAGE_ACCESS_TOKEN + '}'
        },
        body: JSON.stringify(responseBody)
    })
}

const responseMessage = (event: MessageEvent, status: string) => {
    if (event.message.type != "text") return

    const responseBody = {
        replyToken: event.replyToken,
        messages: [
            {
                "type":"text",
                "text":""
            }
        ]
    }
    
    if (event.message.text == "คำสั่ง") {
        responseBody.messages[0].text = "เพิ่มแปลง\nแก้ไขแปลง\nดูแปลง"
        sendResponse(responseBody)
        return
    }

    if (event.message.text == "ดูแปลง") {
        if (!event.source.userId) return
        supabase.from('plots').select("id,name").eq('created_by', event.source.userId)
        .then((res) => {
            if (res.body == null || res.body.length == 0) return
            res.body.forEach((p) => {
                responseBody.messages[0].text += "#" + p.id + " " + p.name + "\n"
            })
            sendResponse(responseBody)
        })
        return
    }
    
    if (event.message.text == "เพิ่มแปลง") {
        supabase.from("users").update({status: "draw"}).match({userId: event.source.userId})
        .then(() => {
            responseBody.messages[0].text = "คุณสามารถเพิ่มแปลงได้ที่ https://liff.line.me/1657196472-B2M98NwJ"
            sendResponse(responseBody)
        })
        return
    }
    
    if (event.message.text == "แก้ไขแปลง") {
        supabase.from("users").update({status: "select"}).match({userId: event.source.userId})
        .then(() => {
            supabase.from('plots').select("id,name").eq('created_by', event.source.userId)
            .then((res) => {
                if (res.body == null || res.body.length == 0) return
                res.body.forEach((p) => {
                    responseBody.messages[0].text += "#" + p.id + " " + p.name + "\n"
                })
                responseBody.messages[0].text += "ใส่เลข ID แปลงที่ต้องการแก้ไข"
                sendResponse(responseBody)
            })
        })
        return
    }

    if (status == "select") {
        const requestPlotId = event.message.text
        supabase.from('plots').select("id")
        .eq('created_by', event.source.userId)
        .eq('id', event.message.text)
        .then((res) => {
            if (res.body == null || res.body.length == 0) {
                supabase.from("users").update({status: "free", param: ""})
                .match({userId: event.source.userId})
                .then(() => {
                    responseBody.messages[0].text = "ไม่สามารถหาแปลงหมายเลข #" + requestPlotId + " ได้"
                    sendResponse(responseBody)
                })
                
            } else {
                supabase.from('users').update({status: "edit", param: requestPlotId})
                .match({userId: event.source.userId})
                .then(() => {
                    responseBody.messages[0].text = "คุณสามารถแก้ไขแปลงได้ที่ https://liff.line.me/1657196472-B2M98NwJ"
                    sendResponse(responseBody)
                })
            }
        })
        return
    }
}

export default responseMessage