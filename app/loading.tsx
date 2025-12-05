export default function GlobalLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="space-y-4 w-full max-w-md">
                <div className="h-4 w-24 bg-muted animate-pulse" />
                <div className="h-10 w-full bg-muted animate-pulse" />
                <div className="h-32 w-full bg-muted animate-pulse" />
                <div className="h-10 w-2/3 bg-muted animate-pulse" />
            </div>
        </div>
    );
}
