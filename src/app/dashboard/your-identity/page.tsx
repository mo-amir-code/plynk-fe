export default function YourIdentityPage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
          <span className="material-symbols-outlined text-4xl">person</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Your Identity</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile, widgets, and how others see you online.</p>
        <div className="p-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl opacity-50">
          <p className="text-sm font-medium text-slate-400">Content coming soon...</p>
        </div>
      </div>
    </div>
  );
}
