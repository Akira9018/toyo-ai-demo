import type { NextApiRequest, NextApiResponse } from 'next'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
})

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const userMessages = req.body.messages
    if (!userMessages || !Array.isArray(userMessages)) {
        return res.status(400).json({ error: 'Invalid messages format' })
    }

    const lecturePath = path.join(process.cwd(), 'data', 'lecture.txt')
    const lectureText = fs.existsSync(lecturePath)
        ? fs.readFileSync(lecturePath, 'utf-8')
        : '講義録が読み込めませんでした。'

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        {
            role: 'system',
            content: `あなたは東洋医学に精通した専門家のAIです。以下の講義録に基づいて、ユーザーの発言から重要な情報を引き出し、1回の返答で1つだけ質問してください。必要な質問を複数回行い、回答に必要な情報が揃ったら、的確な処置や過去の事例をまとめて、わかりやすく
        述べてください、それらを元に担当者が治療を行います。\n\n${lectureText}`,
        },
        ...userMessages,
    ]

    try {
        const chat = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages,
        })

        const answer = chat.choices[0]?.message?.content || '回答が生成できませんでした。'
        res.status(200).json({ result: answer })
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ error: 'AI応答に失敗しました。' })
    }
}
