import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Image as ImageIcon, Trophy, Users, Gavel, LayoutTemplate } from 'lucide-react';

export function AdminLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Banners', path: '/admin/banners', icon: ImageIcon },
    { name: 'Tournaments', path: '/admin/tournaments', icon: Trophy },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Auctions', path: '/admin/auctions', icon: Gavel },
    { name: 'Panels', path: '/admin/panels', icon: LayoutTemplate },
  ];

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-slate-200 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f1117] border-r border-white/5 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link to="/" className="text-xl font-black italic text-white flex items-center gap-2">
            <img src="/logo.svg" alt="SONU Logo" className="w-6 h-6 object-contain" />
            SONU <span className="text-[#FF4655]">ADMIN</span>
          </Link>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium ${
                  isActive 
                    ? 'bg-[#FF4655]/10 text-[#FF4655] border border-[#FF4655]/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={20} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-8 bg-[#0a0b0f] border-b border-white/5">
          <h1 className="text-lg font-semibold text-white">
            {navItems.find(i => location.pathname === i.path || (i.path !== '/admin' && location.pathname.startsWith(i.path)))?.name || 'Admin'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-400">Admin User</div>
            <div className="w-8 h-8 bg-[#FF4655] rounded-full flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Outlet Area */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
