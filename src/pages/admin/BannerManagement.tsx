import { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  date: string;
  isActive: boolean;
}

const INITIAL_BANNERS: Banner[] = [
  {
    id: 1,
    title: 'VALORANT CHAMPIONS TOUR 2026',
    subtitle: '최고를 향한 여정, 지금 시작됩니다.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070',
    date: '2026.07.01 - 2026.08.15',
    isActive: true,
  },
  {
    id: 2,
    title: 'SONU 내전 시즌 3',
    subtitle: '숨겨진 실력자들의 치열한 승부',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071',
    date: '2026.06.20 - 2026.06.30',
    isActive: true,
  }
];

export function BannerManagement() {
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold mb-2">Banner Management</h2>
          <p className="text-slate-400">Manage the sliding banners on the tournament list page.</p>
        </div>
        <button className="bg-[#FF4655] hover:bg-[#ff5c69] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors">
          <Plus size={20} />
          Add Banner
        </button>
      </div>

      <div className="bg-[#0f1117] border border-white/5 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 text-slate-400 text-sm">
              <th className="px-6 py-4 font-medium">Preview</th>
              <th className="px-6 py-4 font-medium">Title & Subtitle</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {banners.map(banner => (
              <tr key={banner.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <div className="w-32 h-16 rounded overflow-hidden bg-slate-800">
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-white mb-1">{banner.title}</div>
                  <div className="text-sm text-slate-400">{banner.subtitle}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-300">{banner.date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full ${banner.isActive ? 'bg-emerald-400/10 text-emerald-400 border border-emerald-400/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-[#FF4655] hover:bg-[#FF4655]/10 rounded transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {banners.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                  No banners found. Click "Add Banner" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
