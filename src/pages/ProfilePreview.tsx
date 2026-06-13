import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield, Crosshair, Eye, Cloud, Edit3, ArrowLeft } from 'lucide-react';
import { NavBar } from '../components/common/NavBar';

const VALORANT_ROLES = [
  { id: 'duelist', name: 'デュエリスト', icon: Crosshair, color: '#FF4655' },
  { id: 'initiator', name: 'イニシエーター', icon: Eye, color: '#00FF9D' },
  { id: 'sentinel', name: 'センチネル', icon: Shield, color: '#F1F5F9' },
  { id: 'controller', name: 'コントローラー', icon: Cloud, color: '#8A2BE2' }
];

export function ProfilePreview() {
  const { user, registeredProfile } = useAuthStore();
  const navigate = useNavigate();

  // If no registration data exists, prompt user to register
  if (!registeredProfile) {
    return (
      <div className="min-h-screen bg-[#0a0b0f] text-[#f1f5f9] font-sans pb-12 flex flex-col">
        <NavBar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-[#0f1117] border border-white/10 p-8 text-center shadow-2xl max-w-md w-full">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#FF4655] mb-4">登録データなし</h2>
            <p className="text-slate-400 mb-8">まだプロフィールの登録が完了していません。</p>
            <button
              onClick={() => navigate('/jp/register')}
              className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors w-full"
            >
              登録ページへ
            </button>
          </div>
        </main>
      </div>
    );
  }

  const displayUser = user || {
    username: 'UnknownAgent',
    discriminator: '0000',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png'
  };

  const selectedRolesData = registeredProfile.roles.map(rId => VALORANT_ROLES.find(r => r.id === rId)).filter(Boolean) as typeof VALORANT_ROLES;

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-[#f1f5f9] font-sans pb-12">
      <NavBar />
      
      <main className="max-w-4xl mx-auto px-4 pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-white/10 pb-6">
          <div className="border-l-4 border-[#00FF9D] pl-4">
            <h1 className="text-3xl font-black uppercase tracking-widest text-slate-100">
              プロフィールプレビュー
            </h1>
            <p className="text-sm text-slate-400 tracking-wider mt-1">
              登録された情報はこちらです。オークション前ならいつでも修正可能です。
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/jp/register')}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold tracking-widest uppercase transition-colors"
            >
              <Edit3 size={16} /> 修正する
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: ID & Roles */}
          <div className="md:col-span-1 flex flex-col gap-6">
            
            {/* Identity Card */}
            <section className="bg-[#0f1117] border border-white/5 p-6 relative shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#5865F2]" />
              <div className="flex flex-col items-center text-center">
                <img 
                  src={displayUser.avatarUrl} 
                  alt="Avatar" 
                  className="w-24 h-24 rounded-full border-2 border-[#5865F2]/50 shadow-[0_0_20px_rgba(88,101,242,0.2)] mb-4"
                />
                <h2 className="text-2xl font-black">{displayUser.username}</h2>
                <p className="text-[#5865F2] font-mono mt-1">#{displayUser.discriminator}</p>
              </div>
            </section>

            {/* Roles Card */}
            <section className="bg-[#0f1117] border border-white/5 p-6 relative shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-6">可能なロール</p>
              
              <div className="flex flex-col gap-4">
                {selectedRolesData.map((role) => {
                  const Icon = role.icon;
                  return (
                    <div 
                      key={role.id} 
                      className="flex items-center gap-4 bg-black/40 p-4 border border-white/5"
                      style={{ borderLeftColor: role.color, borderLeftWidth: '4px' }}
                    >
                      <Icon size={28} color={role.color} />
                      <span className="text-lg font-black tracking-widest" style={{ color: role.color }}>
                        {role.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

          </div>

          {/* Right Column: Agents & Intro */}
          <div className="md:col-span-2 flex flex-col gap-6">
            
            {/* Agents Card */}
            <section className="bg-[#0f1117] border border-white/5 p-6 relative shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#00FF9D]" />
              <h3 className="text-sm text-[#00FF9D] font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00FF9D] inline-block" />
                トップ3 エージェント
              </h3>
              
              <div className="grid grid-cols-3 gap-4">
                {registeredProfile.agents.map((agent, index) => (
                  <div key={index} className="bg-black/40 border border-white/10 flex flex-col items-center justify-center p-4 relative overflow-hidden aspect-square group">
                    <img 
                      src={agent.iconUrl} 
                      alt={agent.name} 
                      className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                    
                    <span className="absolute top-2 left-2 text-[#00FF9D]/40 font-black text-xl italic z-10">0{index + 1}</span>
                    <span className="relative z-10 text-lg font-bold text-white tracking-widest mt-auto drop-shadow-lg">{agent.name}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Intro Card */}
            <section className="bg-[#0f1117] border border-white/5 p-6 relative shadow-xl flex-1">
              <div className="absolute top-0 left-0 w-full h-1 bg-white/20" />
              <h3 className="text-sm text-slate-400 font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-slate-400 inline-block" />
                自己紹介
              </h3>
              
              <div className="bg-black/30 p-6 border-l-4 border-slate-700 min-h-[120px]">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {registeredProfile.intro}
                </p>
              </div>
            </section>

          </div>
        </div>

      </main>
    </div>
  );
}
