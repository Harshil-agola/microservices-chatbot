import { getMessages } from "@/actions/chat.actions"
import { ChatWindow } from "@/components/chatWindow"

const ChatDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params
    const messages = await getMessages(slug)

    return <ChatWindow initialMessages={messages} conversationId={slug} />
}

export default ChatDetailPage