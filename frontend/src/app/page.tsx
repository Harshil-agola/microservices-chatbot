import { getCurrentUser } from "@/actions/auth.actions";
import { redirect } from "next/navigation";

export default async function Home() {

  const user = await getCurrentUser()

  if (!user || !user.status) {
    redirect("/auth/sign-in")
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <pre className="text-white">{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
