"use client"

import { Settings, PanelLeftClose } from "lucide-react"
import type { ConversationType, UserType } from "@/types"
import Image from "next/image"
import { Button } from "../ui/button"
import { useEffect, useRef, useState, useCallback } from "react";
import { Conversations } from "./conversations"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/store"
import { setConversations, setActiveConversationId, toggleSidebar, setSidebarWidth } from "@/store/conversation.slice"
import { NewChatButton } from "./newChatButton"
import { SidebarSearch } from "./sidebarSearch"
import { useParams } from "next/navigation"

export const Sidebar = ({ user, conversations }: { user: UserType, conversations?: ConversationType[] }) => {
    const dispatch = useDispatch();
    const params = useParams();
    const { isSidebarCollapsed, sidebarWidth } = useSelector((state: RootState) => state.conversation);
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (conversations && conversations?.length > 0) {
            dispatch(setConversations(conversations))
        }
    }, [conversations, dispatch])

    useEffect(() => {
        if (params?.slug) {
            dispatch(setActiveConversationId(params.slug as string))
        }
    }, [params?.slug, dispatch])

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizing(true);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;
            const newWidth = Math.min(Math.max(e.clientX, 200), 480);
            dispatch(setSidebarWidth(newWidth));
        };

        const handleMouseUp = () => {
            setIsResizing(false);
        };

        if (isResizing) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isResizing, dispatch]);

    if (isSidebarCollapsed) {
        return null;
    }

    return (
        <div
            ref={sidebarRef}
            style={{ width: `${sidebarWidth}px` }}
            className={`fixed inset-y-0 left-0 z-40 transform bg-(--sidebar-bg) border-r border-(--border-color) md:relative md:translate-x-0 flex flex-col shrink-0 select-none ${isResizing ? "transition-none" : "transition-[width] duration-150 ease-out"
                }`}
        >
            {/* Header with New Chat and Collapse Toggle */}
            <div className="flex items-center justify-between pl-1 pr-3 pt-1">
                <div className="flex-1">
                    <NewChatButton />
                </div>
                <button
                    onClick={() => dispatch(toggleSidebar())}
                    className="p-2 rounded-lg hover:bg-(--user-bubble) text-(--secondary-text) hover:text-(--primary-text) transition-colors cursor-pointer"
                    title="Close sidebar"
                >
                    <PanelLeftClose size={18} />
                </button>
            </div>

            {/* Chat & Message Content Search */}
            <SidebarSearch />

            {/* Conversation List */}
            <Conversations />

            {/* User Footer */}
            <div className="p-2 border-t border-(--border-color) mt-auto">
                <div className="flex items-center justify-between gap-1">
                    <button className="flex items-center gap-2.5 px-2 py-2 w-full rounded-xl hover:bg-(--user-bubble) transition-colors text-sm text-left truncate cursor-pointer">
                        {user?.profileImage ? (
                            <Image width={28} height={28} src={user.profileImage} alt={user.name} className="w-7 h-7 rounded-full object-cover shrink-0" />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-xs shrink-0">
                                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="font-medium text-xs md:text-sm truncate text-(--primary-text)">{user?.name || "User"}</span>
                        </div>
                    </button>
                    <Button variant="ghost" size="sm" className="rounded-lg h-8 w-8 p-0 shrink-0 text-(--secondary-text) hover:text-(--primary-text) hover:bg-(--user-bubble)">
                        <Settings size={16} />
                    </Button>
                </div>
            </div>

            {/* ChatGPT-style draggable resize handle */}
            <div
                onMouseDown={handleMouseDown}
                className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize hover:bg-accent/40 active:bg-accent transition-colors z-50 group"
                title="Drag to resize sidebar"
            >
                <div className="w-0.5 h-full mx-auto group-hover:bg-accent/70 transition-colors" />
            </div>
        </div>
    )
}
