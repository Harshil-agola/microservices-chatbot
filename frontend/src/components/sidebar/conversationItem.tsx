"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RootState } from '@/store'
import { renameConversation } from '@/store/conversation.slice'
import { cn } from 'cn'
import { Edit, EllipsisVertical, Pin, Trash } from 'lucide-react'
import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { renameConversationAction } from '@/actions/chat.actions'
import type { ConversationType } from '@/types'
import { useRouter } from 'next/navigation'

export const ConversationItem = ({ conversation }: { conversation: ConversationType }) => {
    const dispatch = useDispatch()
    const router = useRouter()
    const activeConversationId = useSelector((state: RootState) => state.conversation.activeConversationId)
    const [isHovered, setIsHovered] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    
    const id = conversation._id
    const activeChat = activeConversationId === id
    const showTrigger = isHovered || isMenuOpen

    const startEditing = () => setIsEditing(true)
    const stopEditing = () => setIsEditing(false)

    const handleSingleClick = () => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            return;
        }

        clickTimeoutRef.current = setTimeout(() => {
            if (!activeChat) {
                router.push(`/chat/${id}`);
            }
            clickTimeoutRef.current = null;
        }, 250);
    }

    const handleDoubleClick = () => {
        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
        }
        startEditing();
    }

    const commitRename = async (title: string) => {
        const trimmed = title.trim()
        if (trimmed && trimmed !== conversation.title) {
            const response = await renameConversationAction(id, trimmed)
            if (response.success && response.data) {
                dispatch(renameConversation(response.data))
            }
        }
        stopEditing()
    }

    const handleMenuOpenChange = (open: boolean) => {
        setIsMenuOpen(open)
        if (!open) setIsHovered(false)
    }

    return (
        <li
            className="relative flex items-center gap-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                if (!isMenuOpen) setIsHovered(false)
            }}
        >
            {isEditing ? (
                <div className="flex-1 flex items-center gap-2 min-w-0 px-4 py-2">
                    <div className={cn("p-1 border rounded-full shrink-0", activeChat && "bg-blue-300")} />
                    <Input
                        autoFocus
                        type="text"
                        maxLength={50}
                        minLength={3}
                        defaultValue={conversation.title}
                        className="h-7 min-w-0 flex-1 px-2 text-sm"
                        onFocus={(e) => e.currentTarget.select()}
                        onBlur={(e) => commitRename(e.currentTarget.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") commitRename(e.currentTarget.value)
                            if (e.key === "Escape") stopEditing()
                        }}
                    />
                </div>
            ) : (
                <>
                    <Button
                        variant="ghost"
                        className="cursor-pointer flex-1 flex items-center gap-2 group min-w-0 pr-8"
                        onClick={handleSingleClick}
                        onDoubleClick={handleDoubleClick}
                    >
                        <div className={cn("p-1 border rounded-full shrink-0", activeChat && "bg-blue-300")} />
                        <span className="text-sm truncate flex-1 text-left">{conversation.title}</span>
                    </Button>

                    <DropdownMenu onOpenChange={handleMenuOpenChange}>
                        <DropdownMenuTrigger
                            aria-label="Conversation options"
                            className={cn(
                                "absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer outline-none transition-opacity focus-visible:opacity-100",
                                showTrigger ? "opacity-100" : "opacity-0"
                            )}
                        >
                            <EllipsisVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><Pin size={10} /> Pin</DropdownMenuItem>
                            <DropdownMenuItem onSelect={startEditing}>
                                <Edit size={10} /> Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash size={10} className="text-red-400 hover:bg-red-500" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )}
        </li>
    )
}
