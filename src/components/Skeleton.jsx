
const SHIMMER =
    'bg-gray-200 bg-[length:200%_100%] bg-gradient-to-r from-transparent via-white/60 to-transparent ' +
    'bg-no-repeat [animation:shimmer_1.6s_ease-in-out_infinite] dark:bg-stock-border dark:via-white/10'

export default function Skeleton({ className = 'h-24 w-full', variant = 'block' }) {
    if (variant === 'quote') {
        return (
            <div className={`rounded-xl border border-gray-200 bg-white p-5 dark:border-stock-border dark:bg-stock-card ${className}`}>
                <div className="flex items-start justify-between">
                    <div className={`h-6 w-16 rounded-md ${SHIMMER}`} />      {}
                    <div className="flex flex-col items-end gap-2">
                        <div className={`h-4 w-4 rounded-full ${SHIMMER}`} /> {}
                        <div className={`h-7 w-24 rounded-md ${SHIMMER}`} />  {}
                        <div className={`h-4 w-28 rounded-md ${SHIMMER}`} />  {}
                    </div>
                </div>
                <div className="mt-4 flex gap-3">
                    <div className={`h-3 w-14 rounded ${SHIMMER}`} />         {}
                    <div className={`h-3 w-14 rounded ${SHIMMER}`} />
                    <div className={`h-3 w-16 rounded ${SHIMMER}`} />
                </div>
            </div>
        )
    }

    if (variant === 'chart') {
        return (
            <div className={`rounded-xl border border-gray-200 bg-white p-4 dark:border-stock-border dark:bg-stock-card ${className}`}>
                <div className={`h-4 w-36 rounded ${SHIMMER}`} />
                <div className={`mt-4 h-[calc(100%-1.75rem)] w-full rounded-lg ${SHIMMER}`} />
            </div>
        )
    }

    if (variant === 'bars') {
        return (
            <div className={`rounded-xl border border-gray-200 p-4 dark:border-stock-border ${className}`}>
                <div className={`h-4 w-40 rounded ${SHIMMER}`} />
                <div className={`mt-3 h-[calc(100%-1.75rem)] w-full rounded-lg ${SHIMMER}`} />
            </div>
        )
    }

    if (variant === 'list') {
        return (
            <div className={`space-y-3 ${className}`}>
                {[0, 1, 2].map((i) => (
                    <div key={i} className="flex gap-3">
                        <div className={`h-16 w-16 flex-shrink-0 rounded-lg ${SHIMMER}`} />
                        <div className="min-w-0 flex-1 space-y-2 py-1">
                            <div className={`h-4 w-full rounded ${SHIMMER}`} />
                            <div className={`h-4 w-2/3 rounded ${SHIMMER}`} />
                            <div className={`h-3 w-1/3 rounded ${SHIMMER}`} />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return <div className={`rounded-xl ${SHIMMER} ${className}`} />
}
