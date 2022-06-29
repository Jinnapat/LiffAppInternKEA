import { supabase } from "../../utils/supabaseClient"
import { UserData } from "../handleMessage"

const editPlot = async (userData: UserData) => {
    const added = Object.keys(userData.plot).length > 0;
    if (!added) {
        return [{
            "type": "flex",
            "altText": "No Plot Found",
            "contents": {
                "type": "bubble",
                "styles": {
                    "header": {
                        "backgroundColor": "#deb6ab"
                    }
                },
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "แก้ไขแปลง (ไม่พบแปลง)",
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
                        "url": "https://78ef-110-164-198-126.ap.ngrok.io/edit-file.png",
                        "margin": "lg"
                    }]
                },
                "body": {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "lg",
                    "contents": [
                        {
                            "type": "text",
                            "text": "ไม่พบข้อมูลแปลงของคุณ ทำการเพิ่มแปลงก่อนแก้ไขแปลง",
                            "wrap": true
                        }
                    ]
                }
            }
        }]
    }

    await supabase.from("users").update({status: "edit"}).match({userId: userData.userId})
    return [{
        "type": "flex",
        "altText": "Edit Plot",
        "contents": {
            "type": "bubble",
            "styles": {
                "header": {
                    "backgroundColor": "#deb6ab"
                }
            },
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "แก้ไขแปลง",
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
                    "url": "https://78ef-110-164-198-126.ap.ngrok.io/edit-file.png",
                    "margin": "lg"
                }]
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "lg",
                "contents": [
                    {
                        "type": "text",
                        "text": "คุณสามารถแก้ไขแปลงได้ผ่านลิงค์นี้",
                        "wrap": true
                    },
                    {
                        "type": "button",
                        "style": "primary",
                        "color": "#5f7161",
                        "action": {
                            "type": "uri",
                            "label": "แก้ไขแปลง",
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
            }
        }
    }]
}

export default editPlot