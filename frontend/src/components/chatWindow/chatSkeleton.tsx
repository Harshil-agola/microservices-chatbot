export const ChatSkeleton = () => {
    return (
        <div className="flex-1 flex flex-col justify-between relative h-full w-full bg-(--bg-color) animate-pulse">
            {/* Top Bar Skeleton */}
            <div className="h-12 border-b border-(--border-color)/40 px-4 flex items-center shrink-0">
                <div className="h-6 w-24 bg-(--user-bubble) rounded-md" />
            </div>

            {/* Messages Skeleton */}
            <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col items-center w-full">
                <div className="w-full max-w-3xl flex flex-col gap-8">
                    {/* Assistant Message 1 */}
                    <div className="flex flex-col gap-2.5 w-full max-w-[85%] self-start">
                        <div className="h-4 bg-(--user-bubble) rounded-md w-3/4" />
                        <div className="h-4 bg-(--user-bubble) rounded-md w-full" />
                        <div className="h-4 bg-(--user-bubble) rounded-md w-5/6" />
                    </div>

                    {/* User Message */}
                    <div className="flex flex-col gap-2 max-w-[65%] w-72 self-end">
                        <div className="h-12 bg-(--user-bubble)/80 rounded-2xl rounded-tr-xs" />
                    </div>

                    {/* Assistant Message 2 */}
                    <div className="flex flex-col gap-2.5 w-full max-w-[80%] self-start">
                        <div className="h-4 bg-(--user-bubble) rounded-md w-2/3" />
                        <div className="h-4 bg-(--user-bubble) rounded-md w-4/5" />
                        <div className="h-32 bg-(--user-bubble)/60 rounded-xl w-full mt-2" />
                    </div>
                </div>
            </div>

            {/* Bottom Input Skeleton */}
            <div className="w-full flex flex-col items-center px-4 pt-2 pb-6">
                <div className="w-full max-w-3xl h-14 bg-(--user-bubble)/70 rounded-full border border-(--border-color)" />
            </div>
        </div>
    );
};
