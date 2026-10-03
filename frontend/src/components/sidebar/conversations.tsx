"use client"
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { ConversationItem } from './conversationItem'

export const Conversations = () => {
    const { conversations } = useSelector((state: RootState) => state.conversation)

    return (
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
            <div className="text-xs font-semibold text-(--secondary-text) mb-3 px-2">Recent</div>
            {conversations.length > 0 ? (
                <ul className="space-y-2">
                    {conversations.map((conversation) => (
                        <ConversationItem key={conversation._id} conversation={conversation} />
                    ))}
                </ul>
            ) : (
                <div className="text-center text-(--secondary-text) text-sm mt-8">
                    No conversations yet
                </div>
            )}
        </div>
    )
}