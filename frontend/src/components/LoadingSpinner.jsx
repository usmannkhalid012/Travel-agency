export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-10 text-slate-300">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}