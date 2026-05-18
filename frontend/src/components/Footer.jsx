import { FaWhatsapp, FaLinkedin, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-gradient-to-b from-slate-950/80 to-slate-900/70">
      <div className="section-padding mx-auto grid gap-6 md:grid-cols-3 text-sm text-slate-300">
        <div className="space-y-3 animate-fade-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white font-semibold shadow-glow transform transition-transform duration-500 hover:scale-110">TA</span>
            <div>
              <div className="text-lg font-semibold text-white">Travel Agency</div>
              <div className="text-xs text-slate-400">Premium intercity booking & fleet management</div>
            </div>
          </div>
          <p className="text-sm text-slate-400">Delivering safe, comfortable, and reliable travel experiences. Manage fleets, bookings, and customers with one elegant dashboard.</p>
        </div>

        <div className="flex gap-8">
          <div className="animate-fade-up" style={{ animationDelay: '0.15s' }}>
            <h4 className="mb-3 text-sm font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="hover:text-white transition">Home</li>
              <li className="hover:text-white transition">About</li>
              <li className="hover:text-white transition">Search</li>
              <li className="hover:text-white transition">Contact</li>
            </ul>
          </div>
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h4 className="mb-3 text-sm font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="hover:text-white transition">Help Center</li>
              <li className="hover:text-white transition">Terms</li>
              <li className="hover:text-white transition">Privacy</li>
              <li className="hover:text-white transition">API</li>
            </ul>
          </div>
        </div>

        <div className="animate-fade-up" style={{ animationDelay: '0.25s' }}>
          <h4 className="mb-3 text-sm font-semibold text-white">Get in touch</h4>
          <p className="text-slate-300"><a href="mailto:usmannkhalid012@gmail.com" className="hover:underline">usmannkhalid012@gmail.com</a></p>
          <p className="mt-2 text-slate-400">+92 3088141969</p>
          <div className="mt-4 flex items-center gap-3">
            <a href="https://wa.me/923088141969" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-2xl text-green-400 hover:text-green-500 transform transition duration-300 hover:scale-110 hover:-translate-y-1">
              <FaWhatsapp />
            </a>
            <a href="https://www.linkedin.com/company/travel-agency" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-2xl text-blue-500 hover:text-blue-600 transform transition duration-300 hover:scale-110 hover:-translate-y-1">
              <FaLinkedin />
            </a>
            <a href="https://www.facebook.com/travelagency" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-2xl text-blue-600 hover:text-blue-700 transform transition duration-300 hover:scale-110 hover:-translate-y-1">
              <FaFacebook />
            </a>
          </div>

          <div className="mt-4">
            <label className="block text-xs text-slate-400 mb-2">Subscribe</label>
            <div className="flex gap-2">
              <input placeholder="Email address" className="input-field flex-1" />
              <button className="btn-primary transform transition duration-300 hover:scale-105">Join</button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 text-center text-xs text-slate-500 py-4">
        © {new Date().getFullYear()} Travel Agency — Built with React, Tailwind CSS, Node.js, and MongoDB
      </div>
    </footer>
  );
}