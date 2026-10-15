"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { ArrowUp, BarChart2, Code, FileText, Globe, ImageIcon, Library, Mic, Paperclip, Plus, Presentation, Loader2 } from 'lucide-react'
import { useRef, useState, useTransition } from 'react'
import { useParams, usePathname, useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { createConversation, renameConversationAction } from '@/actions/chat.actions'
import { addConversation } from '@/store/conversation.slice'

const MENU_ITEMS = [
    {
        id: "add-photos",
        icon: Paperclip,
        title: "Add photos & files",
        description: "Upload from computer",
        iconClass: "text-(--primary-text)"
    },
    {
        id: "web-search",
        icon: Globe,
        title: "Web search",
        description: "Find real-time news and info",
        iconClass: "text-blue-500 dark:text-blue-400"
    },
    {
        id: "library",
        icon: Library,
        title: "Add from library",
        description: "Browse and search your files",
        iconClass: "text-(--primary-text)"
    },
    {
        id: "vision",
        icon: ImageIcon,
        title: "Vision",
        description: "Create image, explain email and all media related",
        iconClass: "text-blue-500 dark:text-blue-400"
    },
    {
        id: "coding-agent",
        icon: Code,
        title: "Coding agent",
        description: "Get help with code",
        iconClass: "text-(--primary-text)"
    },
    {
        id: "ppt-agent",
        icon: Presentation,
        title: "PPT agent",
        description: "Create presentations",
        iconClass: "text-(--primary-text)"
    },
    {
        id: "pdf-agent",
        icon: FileText,
        title: "PDF agent",
        description: "Analyze PDF documents",
        iconClass: "text-(--primary-text)"
    },
    {
        id: "visualize",
        icon: BarChart2,
        title: "Visualize",
        description: "Create visualizations and interactive tools",
        iconClass: "text-pink-500 dark:text-pink-400"
    }
];

interface InputBoxProps {
    conversationId?: string;
    onSendMessage?: (content: string) => Promise<void> | void;
}

export const InputBox = ({ conversationId, onSendMessage }: InputBoxProps) => {
    const path = usePathname()
    const router = useRouter()
    const dispatch = useDispatch()
    const [isPending, startTransition] = useTransition()
    const [input, setInput] = useState("")

    const handleSubmit = async () => {
        const trimmed = input.trim();
        if (!trimmed || isPending) return;

        if (path === "/" && !conversationId) {
            startTransition(async () => {
                try {
                    const response = await createConversation();
                    if (response?.data?._id) {
                        const id = response.data._id;
                        const newTitle = trimmed.substring(0, 50);
                        const renameResponse = await renameConversationAction(id, newTitle);

                        if (renameResponse?.success && renameResponse?.data) {
                            dispatch(addConversation(renameResponse.data));
                        } else {
                            dispatch(addConversation(response.data));
                        }

                        setInput("");
                        if (textareaRef.current) {
                            textareaRef.current.style.height = "auto";
                        }
                        router.push(`/chat/${id}`);
                    }
                } catch (error) {
                    console.error("Error creating conversation:", error);
                }
            });
        } else {
            setInput("");
            if (textareaRef.current) {
                textareaRef.current.style.height = "auto";
            }
            if (onSendMessage) {
                await onSendMessage(trimmed);
            }
        }
    }

    const textareaRef = useRef<HTMLTextAreaElement>(null)

    const adjustHeight = () => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="relative flex items-end rounded-3xl border border-(--border-color) bg-(--bg-color) pl-2 pr-2 py-2 shadow-sm hover:border-(--secondary-text)/30 focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/15 transition-all duration-200">

            <DropdownMenu>
                <DropdownMenuTrigger render={<Button variant="secondary" className="rounded-full h-9 w-9 cursor-pointer p-0 flex items-center justify-center shrink-0 mb-0.5 hover:bg-(--user-bubble) transition-colors" />}>
                    <Plus size={16} />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    alignOffset={-8}
                    className="w-[calc(100vw-32px)] max-w-180 p-2 bg-(--bg-color) border border-(--border-color) text-(--primary-text) rounded-3xl shadow-xl flex flex-col gap-0.5"
                    sideOffset={10}
                >
                    {MENU_ITEMS.map((item) => (
                        <DropdownMenuItem key={item.id} className="flex items-center gap-3 p-2.5 rounded-3xl hover:bg-(--user-bubble) cursor-pointer focus:bg-(--user-bubble)">
                            <item.icon size={18} className={item.iconClass} />
                            <div className="flex items-center gap-2" >
                                <span className="text-sm font-medium text-(--primary-text)">{item.title}</span>
                                <span className="text-xs text-(--secondary-text)">{item.description}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}

                </DropdownMenuContent>
            </DropdownMenu>

            <textarea
                ref={textareaRef}
                value={input}
                rows={1}
                onChange={(e) => {
                    setInput(e.target.value)
                    adjustHeight()
                }}
                onKeyDown={handleKeyDown}
                disabled={isPending}
                placeholder="Message Chatbot..."
                className="flex-1 bg-transparent border-none focus:outline-none px-2.5 py-1.5 text-[15px] md:text-[16px] text-(--primary-text) placeholder:text-(--secondary-text) resize-none max-h-50 min-h-9 overflow-y-auto leading-relaxed"
            />

            <div className="flex items-center gap-1 mb-0.5 shrink-0">
                <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-(--secondary-text)">
                    <Mic size={18} />
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={!input.trim() || isPending}
                    className={`h-8 w-8 rounded-full transition-colors flex items-center justify-center shrink-0 ${input.trim()
                        ? "bg-accent text-white hover:opacity-90 cursor-pointer"
                        : "bg-(--border-color) text-(--secondary-text) cursor-not-allowed"
                        }`}
                >
                    {isPending ? <Loader2 size={16} className="animate-spin" /> : <ArrowUp size={16} strokeWidth={2.5} />}
                </button>
            </div>
        </div>
    )
}
