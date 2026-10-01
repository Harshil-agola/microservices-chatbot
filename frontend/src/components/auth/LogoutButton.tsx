"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { logout } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";

export const LogoutButton = () => {
    const router = useRouter();
    const [toast, setToast] = useState<{ status: boolean; message: string } | null>(null);

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = useForm();

    const onSubmit = async () => {
        try {
            const result = await logout();
            setToast(result);

            if (result.status) {
                router.push("/auth/sign-in");
                router.refresh();
            }
        } catch {
            setToast({ status: false, message: "Failed to logout" });
        }
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <form onSubmit={handleSubmit(onSubmit)}>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium flex items-center gap-2 cursor-pointer"
                >
                    {isSubmitting ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Logging out...
                        </>
                    ) : (
                        "Logout"
                    )}
                </button>
            </form>

            {toast && (
                <div
                    className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${toast.status ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                        }`}
                >
                    <span>{toast.status ? "✓" : "⚠"}</span>
                    <span>{toast.message}</span>
                </div>
            )}
        </div>
    );
};
