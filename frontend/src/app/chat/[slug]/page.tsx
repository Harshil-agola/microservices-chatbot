import { getCurrentUser } from "@/actions/auth.actions"
import { getConversations } from "@/actions/chat.actions"
import { Sidebar } from "@/components/sidebar"
import { UserType } from "@/types"
import { redirect } from "next/navigation"

const ChatDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params


    const user = await getCurrentUser()

    if (!user || !user.status) {
        redirect("/auth/sign-in")
    }

    const conversations = await getConversations()

    return (
        <div className="flex h-screen w-full bg-(--bg-color) text-(--primary-text) font-sans overflow-hidden">
            <Sidebar user={user?.data?.user as UserType} conversations={conversations} />
            <div className="flex-1 flex flex-col justify-center items-center text-(--secondary-text)">
                <p>Chat {slug} implementation</p>
            </div>
        </div>
    )
}

export default ChatDetailPage