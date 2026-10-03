"use client"

import { createConversation } from "@/actions/chat.actions";
import { addConversation } from "@/store/conversation.slice";
import { Loader2, Plus } from "lucide-react";
import { useTransition } from "react";
import { useDispatch } from "react-redux";

export const NewChatButton = () => {

    const [isPending, startTransition] = useTransition();
    const dispatch = useDispatch();

    const handleNewChat = () => {
        startTransition(async () => {
            try {
                const response = await createConversation();
                dispatch(addConversation(response.data))
            } catch (error) {
                console.error("Error creating conversation:", error);
            }
        });
    }
    return (
        <div className="p-4">
            <button onClick={handleNewChat} disabled={isPending} className="w-full flex items-center justify-start gap-2 px-3 py-2.5 rounded-xl bg-transparent hover:bg-(--user-bubble) transition-colors border border-(--border-color) disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                <span className="text-sm font-medium">{isPending ? "Creating..." : "New chat"}</span>
            </button>
        </div>
    )
}