"use client"

import { Search } from "lucide-react"
import { useDispatch } from "react-redux"
import { setSearchOpen } from "@/store/conversation.slice"

export const SidebarSearch = () => {
    const dispatch = useDispatch()

    return (
        <div className="px-3 pt-1 pb-2">
            <button
                onClick={() => dispatch(setSearchOpen(true))}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-(--bg-color) border border-(--border-color) text-(--secondary-text) hover:text-(--primary-text) hover:border-(--secondary-text)/30 transition-all text-xs md:text-sm cursor-pointer shadow-xs group"
                title="Search chats (Ctrl + K)"
            >
                <div className="flex items-center gap-2.5">
                    <Search size={15} className="group-hover:text-(--primary-text) transition-colors" />
                    <span>Search chats...</span>
                </div>
                <kbd className="text-[10px] bg-(--user-bubble) text-(--secondary-text) px-1.5 py-0.5 rounded font-mono border border-(--border-color)">
                    Ctrl K
                </kbd>
            </button>
        </div>
    )
}
