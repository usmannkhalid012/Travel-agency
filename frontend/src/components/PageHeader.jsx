export default function PageHeader({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="mb-2 text-sm uppercase tracking-[0.3em] text-violet-300">Travel Agency</p>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-slate-300">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}