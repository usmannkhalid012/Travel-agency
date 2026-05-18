import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { dashboardLinks } from '../utils/constants';

export default function Sidebar() {
  const user = useSelector((state) => state.auth.user);
  const links = user?.role === 'admin' ? dashboardLinks.admin : dashboardLinks.customer;

  return (
    <aside className="glass-card hidden min-h-[calc(100vh-5rem)] w-72 flex-col rounded-none border-l-0 border-t-0 px-4 py-6 lg:flex">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Menu</p>
        <div className="mt-6 space-y-2">
          {links.map((link) => {
            const exact = link.path === '/dashboard' || link.path === '/admin';
            return (
              <NavLink
                key={link.path}
                to={link.path}
                end={exact}
                className={({ isActive }) => `block rounded-2xl px-4 py-3 text-sm transition ${isActive ? 'bg-violet-500/20 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </aside>
  );
}