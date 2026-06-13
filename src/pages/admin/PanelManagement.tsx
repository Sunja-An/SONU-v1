import { useState } from 'react';
import { LayoutTemplate, Search, Plus, Settings } from 'lucide-react';

export function PanelManagement() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for panels
  const panels = [
    { id: 1, name: 'Main Stream Display', type: 'Live Match', active: true, updatedAt: '2026-06-13 14:00' },
    { id: 2, name: 'Auction Room Screen', type: 'Auction', active: true, updatedAt: '2026-06-13 10:30' },
    { id: 3, name: 'Player Stats Overlay', type: 'Statistics', active: false, updatedAt: '2026-06-12 18:45' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <LayoutTemplate className="text-[#FF4655]" />
            Panel Management
          </h2>
          <p className="text-slate-400 text-sm mt-1">Configure stream panels, overlays, and display boards.</p>
        </div>
        <button className="flex items-center gap-2 bg-[#FF4655] hover:bg-[#ff5c69] text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Plus size={18} />
          Create New Panel
        </button>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search panels..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-[#FF4655] transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-black/20 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Panel Name</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Updated</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {panels.map((panel) => (
                <tr key={panel.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{panel.name}</td>
                  <td className="px-6 py-4">{panel.type}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                      panel.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-500/10 text-slate-400'
                    }`}>
                      {panel.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{panel.updatedAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white" title="Manage Settings">
                      <Settings size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
