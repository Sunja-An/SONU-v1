import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield, Crosshair, Eye, Cloud, ArrowRight, ArrowLeft, Check, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { savePlayerProfile } from '../api/players';

const VALORANT_ROLES = [
  { id: 'duelist', name: 'デュエリスト', icon: Crosshair, color: '#FF4655' },
  { id: 'initiator', name: 'イニシエーター', icon: Eye, color: '#00FF9D' },
  { id: 'sentinel', name: 'センチネル', icon: Shield, color: '#F1F5F9' },
  { id: 'controller', name: 'コントローラー', icon: Cloud, color: '#8A2BE2' }
];

export function ProfileRegistration() {
  const { user, registeredProfile, setRegisteredProfile } = useAuthStore();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState(user?.nickname || user?.username || 'UnknownAgent');
  const [riotId, setRiotId] = useState('');
  const [rank, setRank] = useState('GOLD');
  const [tier, setTier] = useState(2);
  const [intro, setIntro] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<{name: string, iconUrl: string}[]>([]);
  const [agentList, setAgentList] = useState<{id: string, name: string, iconUrl: string}[]>([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync nickname when user session loads
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNickname(user.nickname || user.username);
    }
  }, [user]);

  // Fetch agents from Valorant API
  useEffect(() => {
    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true')
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) {
          const agents = (data.data as Array<{ uuid: string; displayName: string; displayIcon: string }>).map((a) => ({
            id: a.uuid,
            name: a.displayName,
            iconUrl: a.displayIcon
          }));
          agents.sort((a, b) => a.name.localeCompare(b.name));
          setAgentList(agents);
        }
      })
      .catch(err => console.error('Failed to fetch agents:', err));
  }, []);

  // Prefill data if user is returning to edit
  useEffect(() => {
    if (registeredProfile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIntro(registeredProfile.intro);
      setSelectedRoles(registeredProfile.roles || []);
      setSelectedAgents(registeredProfile.agents || []);
    }
  }, [registeredProfile]);

  const displayUser = user || {
    username: 'UnknownAgent',
    discriminator: '0000',
    avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png'
  };

  const toggleAgent = (agent: { name: string; iconUrl: string }) => {
    const isSelected = selectedAgents.some(a => a.name === agent.name);
    if (isSelected) {
      setSelectedAgents(selectedAgents.filter(a => a.name !== agent.name));
    } else {
      if (selectedAgents.length < 3) {
        setSelectedAgents([...selectedAgents, agent]);
      }
    }
  };

  const canGoNext = () => {
    if (step === 1) return nickname.trim().length > 0 && riotId.trim().length > 0 && riotId.includes('#');
    if (step === 2) return selectedRoles.length > 0;
    if (step === 3) return selectedAgents.length > 0 && selectedAgents.length <= 3;
    if (step === 4) return intro.trim().length > 0;
    return false;
  };

  const nextStep = () => {
    if (canGoNext() && step < 4) setStep(s => s + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(s => s - 1);
  };

  const handleRegister = async () => {
    if (!canGoNext() || selectedRoles.length === 0) return;
    setIsSubmitting(true);
    
    try {
      await savePlayerProfile({
        nickname: nickname.trim(),
        riot_id: riotId.trim(),
        rank: rank,
        tier: tier,
        main_agent: selectedAgents[0]?.name || 'Jett',
        avatar_url: displayUser.avatarUrl,
      });

      // Save to global store
      setRegisteredProfile({
        roles: selectedRoles,
        agents: selectedAgents,
        intro: intro.trim()
      });

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF4655', '#00FF9D', '#5865F2', '#f1f5f9']
      });
      
      // Navigate to preview page
      navigate('/jp/profile');
    } catch (err) {
      console.error('Failed to register player profile:', err);
      alert('Failed to register profile on the server. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 30 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: -30 }
  };
  const pageTransition = { type: 'tween' as const, ease: 'anticipate' as const, duration: 0.4 };

  const stepTitles = [
    'アカウント確認',
    '可能なロール',
    '得意なエージェント',
    '自己紹介'
  ];

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-[#f1f5f9] font-sans pb-12">
      <main className="max-w-3xl mx-auto px-4 pt-16">
        
        {/* Progress Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black uppercase tracking-widest text-slate-100 mb-6 border-l-4 border-[#FF4655] pl-4">
            エージェント登録 <span className="text-slate-600 ml-2">STEP {step}/4</span>
          </h1>
          
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#FF4655] transition-all duration-500 -z-10" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            {[1, 2, 3, 4].map((s) => (
              <div 
                key={s}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 border-4 border-[#0a0b0f] ${
                  s < step 
                    ? 'bg-[#FF4655] text-white' 
                    : s === step 
                      ? 'bg-slate-800 text-[#FF4655] border-[#FF4655]' 
                      : 'bg-slate-800 text-slate-500'
                }`}
              >
                {s < step ? <Check size={16} strokeWidth={3} /> : s}
              </div>
            ))}
          </div>
          <div className="text-center mt-4 text-[#FF4655] font-bold tracking-widest uppercase">
            {stepTitles[step - 1]}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="relative min-h-[350px]">
          <AnimatePresence mode="wait">
            
            {/* ──────── STEP 1 ──────── */}
            {step === 1 && (
              <motion.div key="step1" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} className="w-full">
                <section className="bg-[#0f1117] border border-white/5 p-8 relative shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5865F2] to-transparent opacity-50" />
                  <p className="text-slate-400 mb-8 tracking-wider">Discord連携が完了しました。アカウント情報およびRiot IDを確認・入力してください。</p>
                  
                  <div className="flex items-center gap-8 bg-black/40 p-6 border border-white/5">
                    <img 
                      src={displayUser.avatarUrl} 
                      alt="Avatar" 
                      className="w-28 h-28 rounded-lg border-2 border-[#5865F2]/50 shadow-[0_0_30px_rgba(88,101,242,0.2)]"
                    />
                    <div>
                      <div className="text-3xl font-black">{displayUser.username}</div>
                      <div className="text-[#5865F2] font-mono text-lg mt-1">#{displayUser.discriminator}</div>
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-[#5865F2]/10 border border-[#5865F2]/30 text-[#5865F2] text-xs font-bold tracking-wider uppercase rounded">
                        <Check size={14} /> Discord 連携済み
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">ニックネーム</label>
                      <input 
                        type="text" 
                        value={nickname} 
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-white/30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Riot ID (Name#Tag)</label>
                      <input 
                        type="text" 
                        value={riotId} 
                        onChange={(e) => setRiotId(e.target.value)}
                        placeholder="Player#KR1"
                        className="w-full bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-white/30 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">現在のランク</label>
                      <select 
                        value={rank} 
                        onChange={(e) => setRank(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-white/30"
                      >
                        {['IRON', 'BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND', 'ASCENDANT', 'IMMORTAL', 'RADIANT'].map(r => (
                          <option key={r} value={r} className="bg-[#0f1117]">{r}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">ティア</label>
                      <select 
                        value={tier} 
                        onChange={(e) => setTier(Number(e.target.value))}
                        className="w-full bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-white/30"
                      >
                        <option value={1} className="bg-[#0f1117]">1 (I)</option>
                        <option value={2} className="bg-[#0f1117]">2 (II)</option>
                        <option value={3} className="bg-[#0f1117]">3 (III)</option>
                      </select>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {/* ──────── STEP 2 ──────── */}
            {step === 2 && (
              <motion.div key="step2" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} className="w-full">
                <section className="bg-[#0f1117] border border-white/5 p-8 relative shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF4655] to-transparent opacity-50" />
                  <p className="text-slate-400 mb-6 tracking-wider">プレイ可能なロールを選択してください（複数選択可）。</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {VALORANT_ROLES.map((role) => {
                      const Icon = role.icon;
                      const isSelected = selectedRoles.includes(role.id);
                      
                      const toggleRole = () => {
                        if (isSelected) {
                          setSelectedRoles(selectedRoles.filter(r => r !== role.id));
                        } else {
                          setSelectedRoles([...selectedRoles, role.id]);
                        }
                      };

                      return (
                        <button
                          key={role.id}
                          onClick={toggleRole}
                          className={`flex flex-col items-center justify-center p-6 border transition-all duration-300 ${
                            isSelected 
                              ? 'bg-white/5 border-white text-white scale-[1.02]' 
                              : 'bg-black/40 border-white/5 text-white/40 hover:border-white/20 hover:text-white/70'
                          }`}
                          style={{
                            borderColor: isSelected ? role.color : undefined,
                            boxShadow: isSelected ? `0 0 20px ${role.color}40` : undefined
                          }}
                        >
                          <Icon size={40} className="mb-4" color={isSelected ? role.color : 'currentColor'} />
                          <span className="text-lg font-black tracking-widest">{role.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </section>
              </motion.div>
            )}

            {/* ──────── STEP 3 ──────── */}
            {step === 3 && (
              <motion.div key="step3" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} className="w-full">
                <section className="bg-[#0f1117] border border-white/5 p-8 relative shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00FF9D] to-transparent opacity-50" />
                  <div className="flex justify-between items-end mb-6">
                    <p className="text-slate-400 tracking-wider">最も自信のあるエージェントを選択してください（最大3名まで）。</p>
                    <span className="text-[#00FF9D] font-bold text-sm tracking-widest">{selectedAgents.length} / 3</span>
                  </div>
                  
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                    {agentList.map(agent => {
                      const isSelected = selectedAgents.some(a => a.name === agent.name);
                      
                      const handleAgentClick = () => {
                        toggleAgent({ name: agent.name, iconUrl: agent.iconUrl });
                      };

                      return (
                        <button
                          key={agent.id}
                          onClick={handleAgentClick}
                          className={`relative aspect-square border-2 transition-all overflow-hidden ${
                            isSelected 
                              ? 'border-[#00FF9D] scale-[1.05] shadow-[0_0_15px_rgba(0,255,157,0.4)] z-10' 
                              : 'border-transparent opacity-60 hover:opacity-100 hover:border-white/20 bg-black/40'
                          }`}
                        >
                          <img src={agent.iconUrl} alt={agent.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                          
                          {isSelected && (
                            <div className="absolute top-1 right-1 bg-[#00FF9D] text-black w-5 h-5 rounded-full flex items-center justify-center font-black text-xs shadow-md">
                              {selectedAgents.findIndex(a => a.name === agent.name) + 1}
                            </div>
                          )}
                          
                          <div className="absolute bottom-1 w-full text-[10px] md:text-xs font-black text-white text-center truncate px-1 drop-shadow-md">
                            {agent.name}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>
              </motion.div>
            )}

            {/* ──────── STEP 4 ──────── */}
            {step === 4 && (
              <motion.div key="step4" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} className="w-full">
                <section className="bg-[#0f1117] border border-white/5 p-8 relative shadow-2xl">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 to-transparent opacity-50" />
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-slate-400 tracking-wider">
                      あなたのプレイスタイルやアピールポイントを入力してください。
                    </p>
                    <span className={`text-sm font-mono font-bold ${intro.length > 500 ? 'text-[#FF4655]' : 'text-slate-500'}`}>
                      {intro.length} / 500
                    </span>
                  </div>
                  
                  <textarea
                    className="w-full h-48 bg-black/40 border border-white/10 p-6 text-base leading-relaxed resize-none focus:outline-none focus:border-white/50 transition-colors shadow-inner"
                    placeholder="例：スモークを中心にプレイしています。過去最高ランクはアセンダント3です。IGL의 경험도 있습니다!"
                    value={intro}
                    maxLength={500}
                    onChange={(e) => setIntro(e.target.value)}
                  />
                </section>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8">
          <button
            onClick={prevStep}
            disabled={step === 1 || isSubmitting}
            className={`flex items-center gap-2 px-6 py-3 font-bold tracking-widest uppercase transition-colors ${
              step === 1 ? 'text-transparent pointer-events-none' : 'text-slate-400 hover:text-white disabled:opacity-50'
            }`}
          >
            <ArrowLeft size={18} /> 戻る
          </button>

          {step < 4 ? (
            <button
              onClick={nextStep}
              disabled={!canGoNext()}
              className={`flex items-center gap-2 px-10 py-4 font-black tracking-widest uppercase transition-all ${
                canGoNext() 
                  ? 'bg-white text-black hover:bg-slate-200 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              次へ <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              onClick={handleRegister}
              disabled={!canGoNext() || isSubmitting}
              className={`flex items-center gap-2 px-10 py-4 font-black tracking-widest uppercase transition-all ${
                canGoNext() && !isSubmitting
                  ? 'bg-[#FF4655] text-white hover:bg-[#ff5a68] shadow-[0_0_20px_rgba(255,70,85,0.4)]'
                  : 'bg-[#FF4655]/20 text-[#FF4655]/50 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Check size={18} />
              )}
              {isSubmitting ? '登録中...' : '登録を完了する'}
            </button>
          )}
        </div>

      </main>
    </div>
  );
}
