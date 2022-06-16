import type { NextApiRequest, NextApiResponse } from 'next';
import { createHmac } from 'crypto';
import { WebhookEvent, WebhookRequestBody } from '@line/bot-sdk'
import addUserToDb from '../../controllers/addUserToDb';
import responseMessage from '../../controllers/responseMessage';
import { supabase } from '../../utils/supabaseClient';

const channelSecret = process.env.MESSAGE_CHANNEL_SECRET as string

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const body: WebhookRequestBody = req.body
    const hmac = createHmac('SHA-256', channelSecret)
    const signature = hmac.update(JSON.stringify(body)).digest('base64')

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