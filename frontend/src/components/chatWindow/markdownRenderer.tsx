"use client"

import { useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"
import { Check, Copy } from "lucide-react"

interface MarkdownRendererProps {
    content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <div className="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed break-words space-y-3 prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0 prose-pre:my-0">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                    p: ({ children }) => <p className="mb-2.5 last:mb-0 leading-relaxed text-(--primary-text)">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc pl-6 my-2.5 space-y-1.5 text-(--primary-text)">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal pl-6 my-2.5 space-y-1.5 text-(--primary-text)">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed pl-1">{children}</li>,
                    h1: ({ children }) => <h1 className="text-xl md:text-2xl font-semibold mt-5 mb-2.5 text-(--primary-text) tracking-tight">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-lg md:text-xl font-semibold mt-4 mb-2 text-(--primary-text) tracking-tight">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-base font-medium mt-3 mb-1.5 text-(--primary-text)">{children}</h3>,
                    blockquote: ({ children }) => (
                        <blockquote className="border-l-3 border-accent/70 pl-4 py-1 italic opacity-90 my-3 text-(--secondary-text)">
                            {children}
                        </blockquote>
                    ),
                    table: ({ children }) => (
                        <div className="overflow-x-auto my-4 border border-(--border-color) rounded-xl shadow-xs bg-(--bg-color)">
                            <table className="min-w-full divide-y divide-(--border-color) text-xs md:text-sm">
                                {children}
                            </table>
                        </div>
                    ),
                    thead: ({ children }) => <thead className="bg-zinc-100/70 dark:bg-zinc-800/50">{children}</thead>,
                    th: ({ children }) => (
                        <th className="px-4 py-3 text-left font-semibold text-(--primary-text) tracking-wide">
                            {children}
                        </th>
                    ),
                    td: ({ children }) => (
                        <td className="px-4 py-3 border-t border-(--border-color) align-top leading-relaxed text-(--primary-text)">
                            {children}
                        </td>
                    ),
                    img: ({ src, alt, ...props }) => (
                        <div className="my-4 overflow-hidden rounded-2xl border border-(--border-color) shadow-md max-w-lg bg-(--user-bubble)/40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={src}
                                alt={alt || "Generated Image"}
                                loading="lazy"
                                className="w-full h-auto object-cover rounded-2xl transition-transform duration-300 hover:scale-[1.01]"
                                {...props}
                            />
                            {alt && (
                                <p className="px-3 py-1.5 text-xs text-(--secondary-text) border-t border-(--border-color)/50 bg-(--bg-color)">
                                    {alt}
                                </p>
                            )}
                        </div>
                    ),
                    pre: ({ children }) => <>{children}</>,
                    code: ({ className, children, ...props }) => {
                        const isBlock = /language-(\w+)/.test(className || "") || String(children).includes("\n");
                        const language = (className || "").replace("language-", "") || "code";

                        if (isBlock) {
                            return <CodeBlock language={language} code={String(children).replace(/\n$/, "")} />;
                        }

                        return (
                            <code className="bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700/80 px-1.5 py-0.5 rounded-md text-[13px] font-mono font-medium inline-block align-middle" {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};

const CodeBlock = ({ code, language }: { code: string; language: string }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy code: ", err);
        }
    };

    return (
        <div className="relative my-3 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-zinc-950 text-zinc-100 shadow-sm">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 text-zinc-300 text-xs border-b border-zinc-800">
                <span className="font-mono lowercase text-zinc-400 font-medium">{language}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-zinc-100 transition-colors cursor-pointer py-1 px-2.5 rounded-md hover:bg-zinc-800 text-xs"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-xs md:text-sm font-mono leading-relaxed bg-zinc-950 text-zinc-100">
                <code>{code}</code>
            </pre>
        </div>
    );
};
