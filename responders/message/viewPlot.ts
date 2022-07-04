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
                        "url": "https://wihvcavkurnzpyyttghd.supabase.co/storage/v1/object/public/images/search.png?t=2022-07-04T03%3A11%3A07.197Z",
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
                    "url": "https://wihvcavkurnzpyyttghd.supabase.co/storage/v1/object/public/images/search.png?t=2022-07-04T03%3A11%3A07.197Z",
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
                        "text": "คุณสามารถดูแปลง \"" + userData.plot_name + "\" พื้นที่ " + userData.area + " ไร่ ได้ผ่านลิงค์นี้",
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