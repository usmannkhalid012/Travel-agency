import { NavLink, useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../redux/slices/uiSlice';
import { navLinks, dashboardLinks } from '../utils/constants';

export default function MobileSidebar() {
  const dispatch = useDispatch();
  const open = useSelector((state) => state.ui.mobileSidebarOpen);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (!open) return null;

  const links = user ? (user.role === 'admin' ? dashboardLinks.admin : dashboardLinks.customer) : navLinks;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={() => dispatch(toggleSidebar())} />
      <aside className="relative w-72 bg-slate-900 p-4 text-white">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold">Menu</h4>
          <button onClick={() => dispatch(toggleSidebar())} aria-label="Close menu" className="btn-secondary"><FiX /></button>
        </div>

        <nav className="mt-6 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => dispatch(toggleSidebar())}
              className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-violet-500/20 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
              {link.label}
            </NavLink>
          ))}

        </nav>

          {user && (
            <>
              <div className="mt-4 pt-4 border-t border-white/5" />
              {(user.role === 'admin' ? dashboardLinks.admin : dashboardLinks.customer).map((link) => {
                const exact = link.path === '/dashboard' || link.path === '/admin';
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    end={exact}
                    onClick={() => dispatch(toggleSidebar())}
                    className={({ isActive }) => `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-violet-500/20 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`}>
                    {link.label}
                  </NavLink>
                );
              })}

              {/* Logout removed from mobile sidebar as requested */}
            </>
          )}
      </aside>
    </div>
  );
}
