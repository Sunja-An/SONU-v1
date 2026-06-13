import { useState } from 'react';
import { Search, MoreVertical, Shield, Ban } from 'lucide-react';

interface User {
  id: string;
  riotId: string;
  discordId: string;
  tier: string;
  role: 'admin' | 'user';
  status: 'active' | 'suspended';
  joinedAt: string;
}

const MOCK_USERS: User[] = [
  {
    id: 'u-001',
    riotId: 'Zephyr#KR1',
    discordId: 'zephyr_01',
    tier: 'Radiant',
    role: 'user',
    status: 'active',
    joinedAt: '2026.01.15',
  },
  {
    id: 'u-002',
    riotId: 'AdminManager#SONU',
    discordId: 'sonu_admin',
    tier: 'Diamond',
    role: 'admin',
    status: 'active',
    joinedAt: '2025.11.01',
  },
  {
    id: 'u-003',
    riotId: 'ToxicPlayer#123',
    discordId: 'toxic_lol',
    tier: 'Iron',
    role: 'user',
    status: 'suspended',
    joinedAt: '2026.05.20',
  }
];

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Global User Management</h2>
          <p className="text-slate-400">View and manage all registered users on the SONU platform.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by Riot ID or Discord..." 
              className="bg-[#0f1117] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#FF4655] text-white w-64 lg:w-80"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-slate-400 text-sm">
              <th className="px-6 py-4 font-medium">User Info (Riot / Discord)</th>
              <th className="px-6 py-4 font-medium">Tier</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Joined At</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-white mb-1">{user.riotId}</div>
                  <div className="text-sm text-slate-400 flex items-center gap-1">
                    <span className="text-indigo-400">@</span>{user.discordId}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-300">{user.tier}</span>
                </td>
                <td className="px-6 py-4">
                  {user.role === 'admin' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-[#FF4655] bg-[#FF4655]/10 px-2.5 py-1 rounded w-fit">
                      <Shield size={12} /> Admin
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2.5 py-1 rounded w-fit">
                      User
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${user.status === 'active' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}>
                    {user.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-400">{user.joinedAt}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end">
                    <button className="p-2 text-slate-400 hover:text-white rounded transition-colors" title="More Actions">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
