const getNoCommand = (command: string) => {
    return [{
        "type": "flex",
        "altText": "The command is not correct",
        "contents": {
            "type": "bubble",
            "styles": {
                "header": {
                    "backgroundColor": "#c2ded1"
                }
            },
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "ไม่พบคำสั่ง",
                        "size": "lg",
                        "weight": "bold"
                    }
                ]
            },
            "hero": {
                "type": "image",
                "url": "https://wihvcavkurnzpyyttghd.supabase.co/storage/v1/object/public/images/query.png?t=2022-07-04T03%3A10%3A29.878Z",
                "offsetTop": "lg"
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "ไม่สามารถทำคำสั่ง \"" + command + "\" ได้",
                        "wrap": true
                    }
                ]
            }
        }
    }]
}

export default getNoCommand