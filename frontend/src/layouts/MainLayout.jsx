import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileSidebar from '../components/MobileSidebar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <MobileSidebar />
      <main className="pt-0">
        <div className="section-padding">
          <div className="max-w-5xl mx-auto w-full">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}