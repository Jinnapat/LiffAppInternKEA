import type { NextApiRequest, NextApiResponse } from 'next';
import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk'
import addUserToDb from '../../controllers/addUserToDb';
import responseMessage from '../../controllers/responseMessage';
import { supabase } from '../../utils/supabaseClient';
import hmacSHA256 from 'crypto-js/hmac-sha256';
import Base64 from 'crypto-js/enc-base64';

const channelSecret = process.env.NEXT_PUBLIC_MESSAGE_CHANNEL_SECRET as string

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    console.log(channelSecret)

    const body: WebhookRequestBody = req.body
    const hmac = hmacSHA256(JSON.stringify(body), channelSecret)
    const signature = Base64.stringify(hmac)

    if (signature != req.headers['x-line-signature']) {
        res.status(401).send({message: "Validate Failed"})
        return
    }

    body.events.forEach((event: WebhookEvent) => {
        supabase.from('users').select("status").eq('userId', event.source.userId)
        .then((res) => {
            if (res.body == null || res.body.length != 1) return
            if (event.type == "follow") addUserToDb(event)
            else if (event.type == "message" && event.message.type == "text") {
                responseMessage(event, res.body[0].status)
            }
        })
        
    })

    res.status(200).send({message: "done"})
}

export default handler;