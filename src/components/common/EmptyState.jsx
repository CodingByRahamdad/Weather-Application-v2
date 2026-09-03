export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#E1E6ED]/55 bg-white/25 px-6 py-10 text-center dark:border-ink-600/35 dark:bg-ink-900/20">
      {icon ? <div className="mb-3 text-ink-400 dark:text-ink-400">{icon}</div> : null}
      <h3 className="font-display text-lg text-ink-900 dark:text-ink-50">{title}</h3>
      {description ? (
        <p className="mt-1 max-w-md text-sm text-ink-500 dark:text-ink-300">{description}</p>
      ) : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
