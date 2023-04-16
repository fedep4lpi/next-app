import type { NextApiRequest, NextApiResponse } from 'next'
import { object, string, InferType } from 'yup'
import bcrypt from 'bcryptjs'

const bodySchema = object({
    username: string().required().min(5).max(20),
    password: string().required().min(8).max(30)
})

type Body = InferType<typeof bodySchema>

type Response = {
    name: string
}

type httpError = {
    devMsg: string,
    errMsg: string,
    errCode: number
}

async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Response | httpError>
) 
{

    try {

        await bodySchema.validate(req.body)

        const body: Body = req.body
        const { username, password } = body
        const password_hash = await bcrypt.hash(password, 10)

        res.status(200).json({ name: password_hash })

    } catch(err) {

        if(err instanceof Error){

            if(err.name==='ValidationError') {

                res.status(406).json({ 
                    devMsg: 'Body not accettable',
                    errMsg: String(err), 
                    errCode: 406 
                })
            }

        }
    }
  
}

export default handler