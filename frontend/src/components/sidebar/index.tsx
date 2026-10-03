"use client"

import { Settings } from "lucide-react"
import type { ConversationType, UserType } from "@/types"
import Image from "next/image"
import { Button } from "../ui/button"
import { useEffect } from "react";
import { Conversations } from "./conversations"
import { useDispatch } from "react-redux"
import { setConversations, setActiveConversationId } from "@/store/conversation.slice"
import { NewChatButton } from "./newChatButton"
import { useParams } from "next/navigation"

export const Sidebar = ({ user, conversations }: { user: UserType, conversations?: ConversationType[] }) => {
    const dispatch = useDispatch();
    const params = useParams();

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

    return (
        <div className={` fixed inset-y-0 left-0 z-40 w-85 transform bg-(--sidebar-bg) border-r border-(--border-color) transition-transform duration-300 md:relative md:translate-x-0 flex flex-col`}>
            <NewChatButton />
            <Conversations />

            <div className="p-1 border-t border-(--border-color)">
                <div className="flex items-center justify-between">
                    <button className="flex items-center gap-3 px-2 py-2.5 w-full rounded-lg hover:bg-(--user-bubble) transition-colors text-sm text-left">
                        {user?.profileImage ? (
                            <Image width={24} height={24} src={user.profileImage} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium shrink-0">
                                {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                        )}
                        <div className="flex flex-col flex-1 overflow-hidden">
                            <span className="font-medium truncate">{user?.name || "User"}</span>
                        </div>
                    </button>
                    <Button variant="secondary" >
                        <Settings />
                    </Button>
                </div>
            </div>
        </div>
    )
}
