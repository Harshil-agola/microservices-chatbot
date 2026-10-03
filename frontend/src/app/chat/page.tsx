import { getCurrentUser } from "@/actions/auth.actions";
import { getConversations } from "@/actions/chat.actions";
import { Sidebar } from "@/components/sidebar";
import type { UserType } from "@/types";
import { redirect } from "next/navigation";
import { ChatWindow } from "@/components/chatWindow";

export default async function ChatApp() {

    const user = await getCurrentUser()

    if (!user || !user.status) {
        redirect("/auth/sign-in")
    }

    const conversations = await getConversations()
    return (
        <div className="flex h-screen w-full bg-(--bg-color) text-(--primary-text) font-sans overflow-hidden transition-colors duration-200">

            <Sidebar user={user?.data?.user as UserType} conversations={conversations} />
            <ChatWindow />
        </div>
    );
}
