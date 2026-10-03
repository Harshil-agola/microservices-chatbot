import { getCurrentUser } from "@/actions/auth.actions";
import { getConversations } from "@/actions/chat.actions";
import { ChatWindow } from "@/components/chatWindow";
import { Sidebar } from "@/components/sidebar";
import type { UserType } from "@/types";
import { redirect } from "next/navigation";

export default async function Home() {

  const user = await getCurrentUser()

  if (!user || !user.status) {
    redirect("/auth/sign-in")
  }

  const conversations = await getConversations()


  return (
    <div className="flex h-screen w-full bg-(--bg-color) text-(--primary-text) font-sans overflow-hidden">
      <Sidebar user={user?.data?.user as UserType} conversations={conversations} />
      <ChatWindow />
    </div>
  );
}
