import { Users, Trophy, Image as ImageIcon, Activity } from 'lucide-react';

export function AdminDashboard() {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Active Tournaments', value: '3', icon: Trophy, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Active Banners', value: '4', icon: ImageIcon, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Site Traffic (Today)', value: '8.4k', icon: Activity, color: 'text-[#FF4655]', bg: 'bg-[#FF4655]/10' },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold mb-8">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#0f1117] border border-white/5 p-6 rounded-xl flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0f1117] border border-white/5 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Recent Registrations</h3>
          <p className="text-slate-400 text-sm">Dashboard widgets would go here. (e.g. chart or recent list)</p>
        </div>
        <div className="bg-[#0f1117] border border-white/5 rounded-xl p-6">
          <h3 className="text-xl font-bold mb-4">Upcoming Tournaments</h3>
          <p className="text-slate-400 text-sm">Dashboard widgets would go here. (e.g. upcoming tournament table)</p>
        </div>
      </div>
    </div>
  );
}
