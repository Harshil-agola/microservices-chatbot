"use client"
import { useEffect, useRef, useState } from "react"
import { Loader2, PanelLeft } from "lucide-react"
import type { MessageType } from "@/types"
import { askAiAction } from "@/actions/chat.actions"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { toggleSidebar } from "@/store/conversation.slice"
import { ImportantNote } from "./importantNote"
import { InputBox } from "./inputBox"

import { MarkdownRenderer } from "./markdownRenderer"

interface ChatWindowProps {
    initialMessages?: MessageType[];
    conversationId?: string;
}

export const ChatWindow = ({ initialMessages = [], conversationId }: ChatWindowProps) => {
    const dispatch = useDispatch();
    const isSidebarCollapsed = useSelector((state: RootState) => state.conversation.isSidebarCollapsed);
    const [messages, setMessages] = useState<MessageType[]>(initialMessages);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages(initialMessages);
    }, [initialMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isSending]);

    const handleSendMessage = async (content: string) => {
        if (!conversationId || !content.trim()) return;

        const optimisticUserMessage: MessageType = {
            conversationId,
            role: "user",
            content: content.trim(),
            createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, optimisticUserMessage]);
        setIsSending(true);

        try {
            const aiResult = await askAiAction(conversationId, content.trim());
            if (aiResult?.response) {
                const aiMessage: MessageType = {
                    conversationId,
                    role: "ai",
                    content: aiResult.response,
                    createdAt: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, aiMessage]);
            } else if (aiResult?.error) {
                const errorMessage: MessageType = {
                    conversationId,
                    role: "ai",
                    content: `⚠️ Error: ${aiResult.error}`,
                    createdAt: new Date().toISOString(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            }
        } catch (error) {
            console.error("Error creating message or getting AI response:", error);
            const errorMessage: MessageType = {
                conversationId,
                role: "ai",
                content: "⚠️ Failed to reach the assistant service. Please check your connection and try again.",
                createdAt: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsSending(false);
        }
    };

    const hasMessages = messages.length > 0;

    return (
        <div className="flex-1 flex flex-col justify-between relative h-full w-full bg-(--bg-color)">
            {/* Top Bar with Sidebar Toggle (only shown when sidebar is collapsed, matching ChatGPT) */}
            {isSidebarCollapsed && (
                <div className="h-12 flex items-center justify-start px-4 border-b border-(--border-color)/40 shrink-0">
                    <button
                        onClick={() => dispatch(toggleSidebar())}
                        className="p-2 rounded-lg hover:bg-(--user-bubble) text-(--secondary-text) hover:text-(--primary-text) transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
                        title="Open sidebar"
                    >
                        <PanelLeft size={18} />
                    </button>
                </div>
            )}

            {!hasMessages ? (
                <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
                    <h1 className="text-2xl md:text-3xl font-medium mb-8 text-(--primary-text)">
                        Where should we begin?
                    </h1>

                    <div className="w-full max-w-180 relative">
                        <InputBox conversationId={conversationId} onSendMessage={handleSendMessage} />
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center w-full">
                    <div className="w-full max-w-3xl flex flex-col gap-6">
                        {messages.map((message, index) => {
                            const isUser = message.role === "user";
                            return (
                                <div
                                    key={message._id || index}
                                    className={`flex items-start gap-3 w-full ${isUser ? "justify-end" : "justify-start"}`}
                                >


                                    <div
                                        className={`rounded-2xl px-4 py-3 text-sm md:text-base leading-relaxed break-words shadow-2xs ${isUser
                                            ? "max-w-[85%] bg-(--user-bubble) text-(--primary-text) rounded-tr-xs ml-auto whitespace-pre-wrap border border-(--border-color)/50"
                                            : "w-full max-w-full bg-transparent text-(--primary-text) px-0 py-1 shadow-none"
                                            }`}
                                    >
                                        {isUser ? (
                                            message.content
                                        ) : (
                                            <MarkdownRenderer content={message.content} />
                                        )}
                                    </div>


                                </div>
                            );
                        })}

                        {isSending && (
                            <div className="flex items-center gap-3 w-full justify-start text-(--secondary-text)">

                                <div className="flex items-center gap-2 py-2 px-3.5 rounded-full bg-(--user-bubble)/60 border border-(--border-color)/60 text-xs text-(--secondary-text)">
                                    <Loader2 size={13} className="animate-spin text-emerald-600" />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>
            )}

            {hasMessages && (
                <div className="w-full flex flex-col items-center px-4 pt-2 pb-2 bg-gradient-to-t from-(--bg-color) via-(--bg-color) to-transparent">
                    <div className="w-full max-w-3xl">
                        <InputBox conversationId={conversationId} onSendMessage={handleSendMessage} />
                    </div>
                </div>
            )}

            <ImportantNote />
        </div>
    );
};