"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { XIcon } from "lucide-react"
import { cn } from "cn"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
    return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
    return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
    return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
    return (
        <DialogPrimitive.Backdrop
            data-slot="dialog-overlay"
            className={cn(
                "fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
                className
            )}
            {...props}
        />
    )
}

function DialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
}: DialogPrimitive.Popup.Props & { showCloseButton?: boolean }) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Popup
                data-slot="dialog-content"
                className={cn(
                    "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-(--sidebar-bg) border border-(--border-color) text-(--primary-text) shadow-2xl transition-all duration-200 outline-none data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
                    className
                )}
                {...props}
            >
                {children}
                {showCloseButton && (
                    <DialogPrimitive.Close
                        data-slot="dialog-close"
                        className="absolute right-4 top-4 rounded-md p-1.5 text-(--secondary-text) hover:text-(--primary-text) hover:bg-(--user-bubble) transition-colors cursor-pointer"
                    >
                        <XIcon className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Popup>
        </DialogPortal>
    )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="dialog-header"
            className={cn("flex flex-col gap-1.5 p-4 text-left", className)}
            {...props}
        />
    )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
    return (
        <DialogPrimitive.Title
            data-slot="dialog-title"
            className={cn("text-base font-semibold text-(--primary-text)", className)}
            {...props}
        />
    )
}

export {
    Dialog,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogHeader,
    DialogTitle,
}
