import { useState } from 'react';
import { Plus, Edit2, Users, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Tournament {
  id: string;
  title: string;
  status: 'recruiting' | 'ongoing' | 'completed';
  teamsCount: number;
  maxTeams: number;
  date: string;
  prize: string;
}

const INITIAL_TOURNAMENTS: Tournament[] = [
  {
    id: '101',
    title: '제 4회 SONU 멸망전',
    status: 'recruiting',
    teamsCount: 6,
    maxTeams: 8,
    date: '2026.06.15',
    prize: '1,000,000 KRW',
  },
  {
    id: '102',
    title: 'VALORANT 직장인 토너먼트',
    status: 'ongoing',
    teamsCount: 16,
    maxTeams: 16,
    date: '2026.06.01 - 06.30',
    prize: '커스텀 키보드 세트',
  }
];

export function TournamentManagement() {
  const [tournaments, setTournaments] = useState<Tournament[]>(INITIAL_TOURNAMENTS);

  const getStatusBadge = (status: Tournament['status']) => {
    switch(status) {
      case 'recruiting': return <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 uppercase tracking-wider">Recruiting</span>;
      case 'ongoing': return <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#FF4655]/10 text-[#FF4655] border border-[#FF4655]/20 uppercase tracking-wider">Ongoing</span>;
      case 'completed': return <span className="px-2.5 py-1 text-xs font-bold rounded bg-slate-800 text-slate-400 border border-slate-700 uppercase tracking-wider">Completed</span>;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Tournament Management</h2>
          <p className="text-slate-400">Manage tournaments, schedules, and view participants.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search tournaments..." 
              className="bg-[#0f1117] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#FF4655] text-white w-64"
            />
          </div>
          <button className="bg-[#FF4655] hover:bg-[#ff5c69] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors whitespace-nowrap">
            <Plus size={20} />
            Create Tournament
          </button>
        </div>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-slate-400 text-sm">
              <th className="px-6 py-4 font-medium">Title</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Teams / Slots</th>
              <th className="px-6 py-4 font-medium">Schedule</th>
              <th className="px-6 py-4 font-medium">Prize</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tournaments.map(t => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-white">{t.title}</div>
                  <div className="text-xs text-slate-500 font-mono mt-1">ID: {t.id}</div>
                </td>
                <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-slate-400" />
                    <span>{t.teamsCount} / {t.maxTeams}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{t.date}</td>
                <td className="px-6 py-4 text-sm text-[#FF4655]">{t.prize}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link to={`/admin/tournaments/${t.id}/users`} className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded transition-colors" title="Manage Participants">
                      <Users size={18} />
                    </Link>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Edit Tournament">
                      <Edit2 size={18} />
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
