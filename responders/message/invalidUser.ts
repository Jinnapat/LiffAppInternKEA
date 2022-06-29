const invalidUser = () => {
    return [{
        "type": "flex",
        "altText": "The command is not correct",
        "contents": {
            "type": "bubble",
            "styles": {
                "header": {
                    "backgroundColor": "#f2d7d9"
                }
            },
            "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "ไม่พบข้อมูลผู้ใช้",
                        "size": "lg",
                        "weight": "bold"
                    }
                ]
            },
            "hero": {
                "type": "image",
                "url": "https://8dd7-110-164-198-126.ap.ngrok.io/question.png",
                "offsetTop": "lg"
            },
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "ไม่พบข้อมูลของคุณในฐานข้อมูล\nลองบล็อคและปลดบล็อคแชทบอทนี้เพื่อเพิ่มข้อมูลของคุณ",
                        "wrap": true
                    }
                ]
            }
        }
    }]
}

export default invalidUser