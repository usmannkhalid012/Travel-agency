import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import MobileSidebar from '../components/MobileSidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MobileSidebar />
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1 pt-16 lg:pt-20">
          <div className="section-padding pt-0 lg:pt-0">
            <div className="max-w-7xl mx-auto w-full">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}