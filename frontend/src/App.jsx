import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { useTheme } from './context/ThemeContext';
import { loadUser } from './redux/slices/authSlice';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { theme } = useTheme();

  useEffect(() => {
    if (user && !localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch, user]);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <AppRoutes />
    </div>
  );
}