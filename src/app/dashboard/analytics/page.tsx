export default function AnalyticsPage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-lg space-y-5 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <span className="material-symbols-outlined text-4xl">monitoring</span>
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Track profile views, widget interactions, and audience growth in one place.
        </p>

        <div className="rounded-3xl border border-slate-200 bg-white px-6 py-8 text-left shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 inline-flex items-center rounded-full border border-amber-300/60 bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/30 dark:text-amber-300">
            Coming Soon
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Advanced Analytics is under active development</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            We’re building a reliable analytics experience with actionable insights and clear performance trends.
          </p>
          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
            Launching soon — this section will be enabled automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
