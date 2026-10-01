import { getCurrentUser } from "@/actions/auth.actions";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function ProfilePage() {

    const user = await getCurrentUser()

    if (!user || !user.status) {
        redirect("/auth/sign-in")
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <h1 className="text-white">{user?.data?.user.name}</h1>
            <p className="text-white">{user?.data?.user.email}</p>
            <p className="text-white">{user?.data?.user.status}</p>
            <Image src={user?.data?.user?.profileImage} alt={`profile-${user?.data?.user.id}`} width={100} height={100} />
        </div>
    );
}
