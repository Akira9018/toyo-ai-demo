type ChatMessageProps = {
    role: 'user' | 'assistant'
    content: string
}

export default function ChatMessage({ role, content }: ChatMessageProps) {
    const isUser = role === 'user'
    return (
        <div className={`my-2 p-3 rounded ${isUser ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}>
            <strong>{isUser ? 'あなた' : '東洋医学AI'}</strong>
            <p className="whitespace-pre-wrap mt-1">{content}</p>
        </div>
    )
}
