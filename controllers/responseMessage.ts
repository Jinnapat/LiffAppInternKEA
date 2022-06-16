import type { MessageEvent } from "@line/bot-sdk/lib/types"
import { supabase } from "../utils/supabaseClient"
import axios from 'axios'
const LINE_REPLY_API = 'https://api.line.me/v2/bot/message/reply'

const sendResponse = (responseBody: any) => {
    console.log("will send response")
    axios(LINE_REPLY_API, {
        method: "post",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {' + process.env.NEXT_PUBLIC_MESSAGE_ACCESS_TOKEN + '}'
        },
        data: JSON.stringify(responseBody)
    })
    .then(() => {
        console.log("sended to line")
    }).catch((e) => {
        console.log(e)
    })
}

const responseMessage = (event: MessageEvent, status: string, param: string) => {
    console.log("In response message function")
    console.log(event)
    console.log(status)
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
    
    console.log(event.message.text)

    if (event.message.text == "คำสั่ง") {
        responseBody.messages[0].text = "เพิ่มแปลง\nแก้ไขแปลง\nดูแปลง\nรายการแปลง"
        sendResponse(responseBody)
        return
    }

    if (event.message.text == "รายการแปลง") {
        if (!event.source.userId) return
        supabase.from('plots').select("id,name").eq('created_by', event.source.userId)
        .then((res) => {
            if (res.body == null || res.body.length == 0) return
            res.body.forEach((p, idx) => {
                responseBody.messages[0].text += "#" + p.id + " " + p.name + (idx < res.body.length - 1 ? "\n" : "")
            })
            sendResponse(responseBody)
        })
        return
    }
    
    if (event.message.text == "เพิ่มแปลง") {
        supabase.from("users").update({status: "draw", param: ""}).match({userId: event.source.userId})
        .then(() => {
            responseBody.messages[0].text = "คุณสามารถเพิ่มแปลงได้ที่ https://liff.line.me/1657196472-B2M98NwJ"
            sendResponse(responseBody)
        })
        return
    }
    
    if (event.message.text == "แก้ไขแปลง") {
        supabase.from("users").update({status: "select", param: "edit"}).match({userId: event.source.userId})
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

    if (event.message.text == "ดูแปลง") {
        supabase.from("users").update({status: "select", param: "view"}).match({userId: event.source.userId})
        .then(() => {
            supabase.from('plots').select("id,name").eq('created_by', event.source.userId)
            .then((res) => {
                if (res.body == null || res.body.length == 0) return
                res.body.forEach((p) => {
                    responseBody.messages[0].text += "#" + p.id + " " + p.name + "\n"
                })
                responseBody.messages[0].text += "ใส่เลข ID แปลงที่ต้องการดู"
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
                    responseBody.messages[0].text = "ไม่สามารถหาแปลงหมายเลข #" + requestPlotId + " ได้\nยกเลิกการ" + (param == "edit" ? "แก้ไข" : "ดู") + "แปลง"
                    sendResponse(responseBody)
                })
                
            } else {
                supabase.from('users').update({status: param, param: requestPlotId})
                .match({userId: event.source.userId})
                .then(() => {
                    responseBody.messages[0].text = "คุณสามารถ" + (param == "edit" ? "แก้ไข" : "ดู") + "แปลงได้ที่ https://liff.line.me/1657196472-B2M98NwJ"
                    sendResponse(responseBody)
                })
            }
        })
        return
    }
}

export default responseMessage