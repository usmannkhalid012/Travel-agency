import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMenu } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../redux/slices/uiSlice';
import { navLinks } from '../utils/constants';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    function handleClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);
  

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto w-full h-full flex items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-lg font-semibold text-white">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500">BT</span>
          Travel Agency
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.path} to={link.path} className={({ isActive }) => `text-sm transition ${isActive ? 'text-white' : 'text-slate-300 hover:text-white'}`}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen((s) => !s)}
                className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-sm text-white hover:opacity-90"
                aria-haspopup="true"
                aria-expanded={open}
              >
                {user.profileImage ? (
                  <img src={user.profileImage} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <span className="h-8 w-8 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-sm font-semibold">{(user.name || user.email || 'U')[0].toUpperCase()}</span>
                )}
                <span className="hidden sm:inline">{user.name || user.email}</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-slate-900/90 border border-white/5 shadow-lg py-2">
                  {(() => {
                    const dashboardPath = user.role === 'admin' ? '/admin' : '/dashboard';
                    const items = [
                      { to: '/dashboard/profile', label: 'Profile', match: '/dashboard/profile' },
                    ];
                    return items
                      .filter((it) => !location.pathname.startsWith(it.match))
                      .map((it) => (
                        <Link key={it.to} to={it.to} onClick={() => setOpen(false)} className="block px-4 py-2 text-sm text-slate-200 hover:bg-white/5">
                          {it.label}
                        </Link>
                      ));
                  })()}
                  <button
                    onClick={async () => {
                      setOpen(false);
                      await dispatch(logout()).unwrap?.();
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-white/5"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn-primary hidden sm:inline-flex">Login</Link>
          )}
          <button onClick={() => dispatch(toggleSidebar())} className="btn-secondary px-2 py-2 h-10 flex items-center justify-center ml-2" aria-label="Open menu">
            <FiMenu />
          </button>
        </div>
      </div>
    </header>
  );
}