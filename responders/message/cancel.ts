import { supabase } from "../../utils/supabaseClient"
import { UserData } from "../handleMessage"

const cancal = async (userData: UserData) => {
    await supabase.from("users").update({status: "free", param: ""}).match({userId: userData.userId})
    return [{
        "type": "flex",
        "altText": "View Plot",
        "contents": {
            "type": "bubble",
            "styles": {
                "header": {
                    "backgroundColor": "#ffdefa"
                }
            },
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "คำสั่งถูกยกเลิกแล้ว",
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
                    "url": "https://wihvcavkurnzpyyttghd.supabase.co/storage/v1/object/public/images/cancel.png?t=2022-07-04T03%3A07%3A12.734Z",
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
                        "text": "ยกเลิกคำสั่งแล้ว",
                        "wrap": true
                    }
                ]
            }
        }
    }]
}

export default cancal