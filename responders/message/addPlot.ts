import { supabase } from "../../utils/supabaseClient"
import { UserData } from "../handleMessage"

const addPlot = async (userData: UserData) => {
    const added = Object.keys(userData.plot).length > 0;
    await supabase.from("users").update({status: "draw"}).match({userId: userData.userId})

    var warning = [{
        "type": "text",
        "text": "คุณมีข้อมูลแปลงอยู่ในฐานข้อมูลอยู่แล้ว ข้อมูลแปลงเก่าจะถูกเขียนทับ",
        "wrap": true
    }]

    var content: Array<any> = [
        {
            "type": "text",
            "text": "คุณสามารถเพิ่มแปลงได้ผ่านลิงค์นี้",
            "wrap": true
        },
        {
            "type": "button",
            "style": "primary",
            "color": "#5f7161",
            "action": {
                "type": "uri",
                "label": "เพิ่มแปลง",
                "uri": "https://liff.line.me/1657196472-B2M98NwJ"
            }
        },
        {
            "type": "button",
            "style": "primary",
            "color": "#bb6464",
            "action": {
                "type": "message",
                "label": "ยกเลิก",
                "text": "ยกเลิก"
            }
        }
    ]

    if (added) content = warning.concat(content)
    return [{
        "type": "flex",
        "altText": "Add Plot",
        "contents": {
            "type": "bubble",
            "styles": {
                "header": {
                    "backgroundColor": "#f9ebc8"
                }
            },
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "เพิ่มแปลง",
                        "size": "lg",
                        "weight": "bold"
                    }
                ]
            },
            "hero": {
                "type": "box",
                "layout": "vertical",
                "contents": [{
                    "type": "image",
                    "url": "https://78ef-110-164-198-126.ap.ngrok.io/book.png",
                    "margin": "lg"
                }]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "lg",
                "contents": content
            }
        }
    }]
}

export default addPlot