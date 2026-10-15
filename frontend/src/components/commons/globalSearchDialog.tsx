"use client"

import { useState, useTransition, useEffect, useRef } from "react"
import { Search, Loader2, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { setSearchOpen } from "@/store/conversation.slice"
import { searchChatsAction } from "@/actions/chat.actions"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface SearchResultItem {
    conversationId: string;
    title: string;
    matchSnippet: string;
    role?: string;
}

const stripMarkdown = (text: string) => {
    if (!text) return "";
    return text
        .replace(/(\*\*|__)(.*?)\1/g, "$2")
        .replace(/(\*|_)(.*?)\1/g, "$2")
        .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
        .replace(/#+\s+/g, "")
        .replace(/\[(.*?)\]\(.*?\)/g, "$1")
        .replace(/!\[(.*?)\]\(.*?\)/g, "")
        .replace(/<[^>]*>/g, "")
        .replace(/\n+/g, " ")
        .trim();
};

export const GlobalSearchDialog = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const isOpen = useSelector((state: RootState) => state.conversation.isSearchOpen)
    const conversations = useSelector((state: RootState) => state.conversation.conversations)

    const [query, setQuery] = useState("")
    const [results, setResults] = useState<SearchResultItem[]>([])
    const [isPending, startTransition] = useTransition()
    const inputRef = useRef<HTMLInputElement>(null)

    // Keyboard shortcut (Ctrl+K or Cmd+K) to open search anywhere
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                dispatch(setSearchOpen(true))
            }
        }
        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [dispatch])

    // Focus input and reset when opened/closed
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 60)
        } else {
            setQuery("")
            setResults([])
        }
    }, [isOpen])

    // Search query debouncing
    useEffect(() => {
        if (!query.trim()) {
            setResults([])
            return
        }

        const timer = setTimeout(() => {
            startTransition(async () => {
                const data = await searchChatsAction(query.trim())
                setResults(data || [])
            })
        }, 200)

        return () => clearTimeout(timer)
    }, [query])

    const handleSelectChat = (conversationId: string) => {
        dispatch(setSearchOpen(false))
        router.push(`/chat/${conversationId}`)
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => dispatch(setSearchOpen(open))}>
            <DialogContent className="w-[92vw] max-w-2xl p-0 overflow-hidden bg-(--sidebar-bg) border border-(--border-color) rounded-2xl shadow-2xl">
                {/* Search Bar Header */}
                <div className="relative flex items-center px-4 py-3.5 border-b border-(--border-color) bg-transparent">
                    <Search size={18} className="text-(--secondary-text) shrink-0 mr-3" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search chats and messages..."
                        className="w-full bg-transparent border-none text-base text-(--primary-text) placeholder:text-(--secondary-text) focus:outline-none pr-8"
                    />
                    {isPending && <Loader2 size={16} className="animate-spin text-(--secondary-text) shrink-0 mr-4" />}
                </div>

                {/* Search Results & Recent Chats List */}
                <div className="max-h-[60vh] md:max-h-115 overflow-y-auto p-2 space-y-1">
                    {!query.trim() ? (
                        <div>
                            <div className="px-3 py-2 text-xs font-medium text-(--secondary-text)">
                                Recent chats
                            </div>
                            <div className="space-y-0.5">
                                {conversations && conversations.length > 0 ? (
                                    conversations.slice(0, 10).map((conv) => (
                                        <button
                                            key={conv._id}
                                            onClick={() => handleSelectChat(conv._id)}
                                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-(--user-bubble) text-(--primary-text) transition-colors flex items-center gap-3 cursor-pointer group"
                                        >
                                            <MessageSquare size={16} className="text-(--secondary-text) shrink-0" />
                                            <span className="text-sm font-normal truncate">
                                                {conv.title || "Untitled Chat"}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="py-12 text-center text-xs text-(--secondary-text)">
                                        No recent chats
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="px-3 py-1.5 text-xs font-medium text-(--secondary-text) flex items-center justify-between">
                                <span>Results</span>
                                <span className="text-[11px]">{results.length} found</span>
                            </div>

                            {!isPending && results.length === 0 ? (
                                <div className="py-14 text-center text-xs text-(--secondary-text)">
                                    No matching chats or messages found
                                </div>
                            ) : (
                                <div className="space-y-1 mt-1">
                                    {results.map((res) => (
                                        <button
                                            key={res.conversationId}
                                            onClick={() => handleSelectChat(res.conversationId)}
                                            className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-(--user-bubble) text-(--primary-text) transition-colors flex items-start gap-3 cursor-pointer group"
                                        >
                                            <MessageSquare size={16} className="text-(--secondary-text) shrink-0 mt-0.5" />
                                            <div className="flex-1 overflow-hidden">
                                                <div className="text-sm font-normal text-(--primary-text) truncate">
                                                    {res.title || "Untitled Chat"}
                                                </div>
                                                <div className="text-xs text-(--secondary-text) line-clamp-1 mt-0.5">
                                                    {stripMarkdown(res.matchSnippet)}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
