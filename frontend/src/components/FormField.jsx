export default function FormField({ label, error, ...props }) {
  return (
    <label className="block space-y-2">
      {label && <span className="text-sm text-slate-300">{label}</span>}
      <input {...props} className={`input-field ${props.className || ''}`} />
      {error && <span className="text-xs text-rose-300">{error}</span>}
    </label>
  );
}