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
                "url": "https://wihvcavkurnzpyyttghd.supabase.co/storage/v1/object/public/images/question.png?t=2022-07-04T03%3A11%3A56.118Z",
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