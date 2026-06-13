import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Search } from 'lucide-react';

interface Participant {
  id: string;
  riotId: string;
  role: string;
  tier: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

const MOCK_PARTICIPANTS: Participant[] = [
  { id: 'p1', riotId: 'Zephyr#KR1', role: 'Duelist', tier: 'Radiant', status: 'pending', appliedAt: '2026.06.01 14:20' },
  { id: 'p2', riotId: 'WraithX#000', role: 'Controller', tier: 'Immortal', status: 'approved', appliedAt: '2026.06.01 15:10' },
  { id: 'p3', riotId: 'NoobMaster#69', role: 'Sentinel', tier: 'Silver', status: 'rejected', appliedAt: '2026.06.02 09:00' },
];

export function TournamentUsers() {
  const { tournamentId } = useParams();
  const [participants, setParticipants] = useState<Participant[]>(MOCK_PARTICIPANTS);

  const handleStatusChange = (id: string, newStatus: 'approved' | 'rejected') => {
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
  };

  return (
    <div>
      <div className="mb-6">
        <Link to="/admin/tournaments" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-4">
          <ArrowLeft size={16} /> Back to Tournaments
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Tournament Participants</h2>
            <p className="text-slate-400 font-mono text-sm">Tournament ID: {tournamentId}</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search participants..." 
              className="bg-[#0f1117] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#FF4655] text-white w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-slate-400 text-sm">
              <th className="px-6 py-4 font-medium">Riot ID</th>
              <th className="px-6 py-4 font-medium">Role</th>
              <th className="px-6 py-4 font-medium">Tier</th>
              <th className="px-6 py-4 font-medium">Applied At</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {participants.map(p => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-bold text-white">{p.riotId}</td>
                <td className="px-6 py-4 text-sm text-slate-300">{p.role}</td>
                <td className="px-6 py-4 text-sm font-semibold">{p.tier}</td>
                <td className="px-6 py-4 text-sm text-slate-400">{p.appliedAt}</td>
                <td className="px-6 py-4">
                  {p.status === 'pending' && <span className="px-2.5 py-1 text-xs font-bold rounded bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pending</span>}
                  {p.status === 'approved' && <span className="px-2.5 py-1 text-xs font-bold rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Approved</span>}
                  {p.status === 'rejected' && <span className="px-2.5 py-1 text-xs font-bold rounded bg-red-500/10 text-red-500 border border-red-500/20">Rejected</span>}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {p.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => handleStatusChange(p.id, 'approved')}
                          className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded transition-colors" title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(p.id, 'rejected')}
                          className="p-1.5 text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    )}
                    {p.status !== 'pending' && (
                      <span className="text-xs text-slate-500 italic">Processed</span>
                    )}
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
