"use client";

import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/utils/firebase";
import { handleLoginAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";

export const OauthButton = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter()

    const handleSignIn = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const userCredential = await signInWithPopup(auth, googleProvider);
            const token = await userCredential.user.getIdToken();

            const response = await handleLoginAction(token);

            if (!response?.status) {
                throw new Error(response?.message || "Failed to authenticate with server");
            }
            router.push("/")
        } catch (err: unknown) {
            console.error("Sign-in error:", err);

            // Handle client-side Firebase Auth errors
            if (err && typeof err === "object" && "code" in err) {
                const firebaseCode = (err as { code: string }).code;
                if (firebaseCode === "auth/popup-closed-by-user") {
                    setError("Popup closed by the user");
                    return;
                }
                if (firebaseCode === "auth/popup-blocked") {
                    setError("Sign-in popup was blocked by your browser. Please allow popups and try again.");
                    return;
                }
                if (firebaseCode === "auth/cancelled-popup-request") {
                    setError("Sign-in was cancelled");
                    return;
                }
            }

            const errorMessage = err instanceof Error ? err.message : "Something went wrong during sign-in";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={handleSignIn}
                disabled={isLoading}
                className="bg-purple-800 hover:bg-purple-700 disabled:opacity-50 w-fit px-4 py-2 text-white rounded-full flex items-center gap-2 cursor-pointer transition-colors"
            >
                {isLoading ? "Signing in..." : "Continue with Google"}
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};
