export default function StatCard({ label, value, icon, hint }) {
  return (
    <div className="glass-card rounded-3xl p-5 animate-fade-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-300">{label}</p>
          <h3 className="mt-2 text-3xl font-semibold text-white">{value}</h3>
          {hint && <p className="mt-2 text-xs text-slate-400">{hint}</p>}
        </div>
        <div className="rounded-2xl bg-white/10 p-3 text-2xl text-violet-300">{icon}</div>
      </div>
    </div>
  );
}