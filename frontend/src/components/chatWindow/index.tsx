"use client"

import { Plus, Mic, ArrowUp } from "lucide-react"
import { useState } from "react"

export const ChatWindow = () => {
    const [input, setInput] = useState("")

    return (
        <div className="flex-1 flex flex-col justify-between relative h-full w-full bg-(--bg-color)">
            <div className="flex-1 flex flex-col items-center justify-center px-4 w-full">
                <h1 className="text-2xl md:text-3xl font-medium mb-8 text-(--primary-text)">
                    Where should we begin?
                </h1>

                <div className="w-full max-w-[720px] relative">
                    <div className="flex items-center bg-(--user-bubble) rounded-full border border-(--border-color) pl-2 pr-1.5 py-1.5 shadow-sm focus-within:bg-transparent transition-colors duration-200">
                        <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-(--secondary-text)">
                            <Plus size={20} />
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Message Chatbot..."
                            className="flex-1 bg-transparent border-none focus:outline-none px-2 py-2 text-[16px] text-(--primary-text) placeholder:text-(--secondary-text)"
                        />

                        <div className="flex items-center gap-1">
                            <button className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-(--secondary-text)">
                                <Mic size={18} />
                            </button>
                            <button
                                disabled={!input.trim()}
                                className={`h-8 w-8 rounded-full transition-colors flex items-center justify-center shrink-0 ${input.trim()
                                    ? "bg-(--accent) text-white hover:opacity-90"
                                    : "bg-(--border-color) text-(--secondary-text) cursor-not-allowed"
                                    }`}
                            >
                                <ArrowUp size={16} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="pb-4 pt-2 text-center w-full px-4">
                <p className="text-xs text-(--secondary-text)">
                    Chatbot is an AI. By using it, you agree to our Terms & Privacy Policy. Chatbot can make mistakes.
                </p>
            </div>
        </div>
    )
}