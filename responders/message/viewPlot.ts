import { supabase } from "../../utils/supabaseClient"
import { UserData } from "../handleMessage"

const viewPlot = async (userData: UserData) => {
    const added = Object.keys(userData.plot).length > 0;
    if (!added) {
        return [{
            "type": "flex",
            "altText": "No Plot Found",
            "contents": {
                "type": "bubble",
                "styles": {
                    "header": {
                        "backgroundColor": "#b4cfb0"
                    }
                },
                "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                        {
                            "type": "text",
                            "text": "ดูแปลง (ไม่พบแปลง)",
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
                        "url": "https://78ef-110-164-198-126.ap.ngrok.io/search.png",
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
    await supabase.from("users").update({status: "view"}).match({userId: userData.userId})
    return [{
        "type": "flex",
        "altText": "View Plot",
        "contents": {
            "type": "bubble",
            "styles": {
                "header": {
                    "backgroundColor": "#b4cfb0"
                }
            },
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "ดูแปลง",
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
                    "url": "https://78ef-110-164-198-126.ap.ngrok.io/search.png",
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
                        "text": "คุณสามารถดูแปลงได้ผ่านลิงค์นี้",
                        "wrap": true
                    },
                    {
                        "type": "button",
                        "style": "primary",
                        "color": "#5f7161",
                        "action": {
                            "type": "uri",
                            "label": "ดูแปลง",
                            "uri": "https://liff.line.me/1657196472-B2M98NwJ"
                        }
                    }
                ]
            }
        }
    }]
}

export default viewPlot