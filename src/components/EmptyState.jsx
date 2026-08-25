
export default function EmptyState({ icon = '📊', message, className = '' }) {
    return (
        <div className={`flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500 dark:border-stock-border dark:text-stock-muted ${className}`}>
            <span className="text-2xl" aria-hidden="true">{icon}</span>
            <p>{message}</p>
        </div>
    )
}
