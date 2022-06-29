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
                "url": "https://8dd7-110-164-198-126.ap.ngrok.io/query.png",
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