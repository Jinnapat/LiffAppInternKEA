import type { NextApiRequest, NextApiResponse } from 'next'
import { WebhookRequestBody } from '@line/bot-sdk'
import handleUserFollow from '../../responders/handleUserFollow'
import handleMessage from '../../responders/handleMessage'
import { HmacSHA256 } from 'crypto-js'
import Base64 from 'crypto-js/enc-base64';

const channelSecret = process.env.NEXT_PUBLIC_MESSAGE_CHANNEL_SECRET as string

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    console.log("bot requested")
    const requestBody: WebhookRequestBody = req.body

    const hmac = HmacSHA256(JSON.stringify(requestBody), channelSecret)
    const signature = Base64.stringify(hmac)

    if (signature != req.headers['x-line-signature']) {
        res.status(401).end()
        return
    }

    requestBody.events.forEach((event) => {
        if (event.type == "follow") handleUserFollow(event)
        else if (event.type == "message") handleMessage(event)
    })

    res.status(200).end()
}

export default handler