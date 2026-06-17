import { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Check, Loader2, AlertCircle } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { SuccessAnimation } from './SuccessAnimation';
import { fetchValorantData, type ValorantAgent, type ValorantRole } from '../../api/valorant';
import { useAuthStore } from '../../store/authStore';
import { savePlayerProfile, addTournamentParticipant } from '../../api/players';

const TIERS = [
  'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'
];

export function ApplicationForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tournamentId } = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const lang = location.pathname.startsWith('/jp') ? 'jp' : 'kr';
  
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [valorantData, setValorantData] = useState<{agents: ValorantAgent[], roles: ValorantRole[]}>({ agents: [], roles: [] });
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    isLeader: false,
    riotId: '',
    discordId: user?.username || '', // Auto-fill if user exists
    role: '', // role uuid
    agents: [] as string[], // array of agent uuids
    currentTier: '',
    peakTier: '',
    introduction: ''
  });

  // Keep Discord ID updated if user loads later
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData(prev => ({ ...prev, discordId: user.username }));
    }
  }, [user]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    fetchValorantData(lang).then(data => {
      setValorantData(data);
      setIsLoading(false);
    });
  }, [lang]);

  const handleNext = () => {
    if (step === 1 && (!formData.riotId || !formData.discordId)) return;
    if (step === 2 && (!formData.role || formData.agents.length === 0 || !formData.currentTier)) return;
    if (step === 3 && !formData.introduction) return;
    setStep(prev => prev + 1);
  };

  const handlePrev = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId) {
      setSubmitError('Invalid Tournament ID');
      return;
    }
    if (!user) {
      setSubmitError('You must be logged in to apply for this tournament. Please log in with Discord first.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const rankUpper = (formData.currentTier || 'GOLD').toUpperCase();
      const firstAgentUuid = formData.agents[0];
      const mainAgentName = valorantData.agents.find(a => a.uuid === firstAgentUuid)?.displayName || 'Jett';

      // 1. Save player profile details to Redis
      await savePlayerProfile({
        nickname: user.nickname || user.username || 'UnknownAgent',
        riot_id: formData.riotId,
        rank: rankUpper,
        tier: 1, // Default tier
        main_agent: mainAgentName,
        avatar_url: user.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png',
      });

      // 2. Add to tournament participants
      const participantRole = formData.isLeader ? 'LEADER' : 'MEMBER';
      await addTournamentParticipant(tournamentId, {
        user_id: user.id,
        role: participantRole,
      });

      setIsSubmitted(true);
    } catch (err: unknown) {
      console.error('Failed to submit tournament application:', err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setSubmitError((err as any).response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAgent = (agentUuid: string) => {
    setFormData(prev => {
      const isSelected = prev.agents.includes(agentUuid);
      if (isSelected) {
        return { ...prev, agents: prev.agents.filter(id => id !== agentUuid) };
      }
      if (prev.agents.length >= 3) return prev;
      return { ...prev, agents: [...prev.agents, agentUuid] };
    });
  };

  if (isSubmitted) {
    return <SuccessAnimation onComplete={() => navigate(`/${lang}/tournaments`)} />;
  }

  // Get selected role and agent names for the review step
  const selectedRoleName = valorantData.roles.find(r => r.uuid === formData.role)?.displayName || '';
  const selectedAgentNames = formData.agents
    .map(uuid => valorantData.agents.find(a => a.uuid === uuid)?.displayName)
    .filter(Boolean)
    .join(', ');

  return (
    <div className="w-full max-w-4xl mx-auto bg-[#1A1A1A] border border-[#333333] p-6 md:p-12 relative overflow-hidden group">
      {/* Decorative corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF4655]" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#FF4655]" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#FF4655]" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF4655]" />

      {/* Progress Bar (4 Steps) */}
      <div className="flex items-center mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className={`w-10 h-10 flex items-center justify-center font-bold text-sm transition-colors shrink-0 ${
              step >= i ? 'bg-[#FF4655] text-white' : 'bg-[#2A2A2A] text-gray-500'
            }`} style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}>
              {step > i ? <Check size={16} /> : i}
            </div>
            {i < 4 && (
              <div className={`flex-1 h-1 mx-2 transition-colors ${
                step > i ? 'bg-[#FF4655]' : 'bg-[#2A2A2A]'
              }`} />
            )}
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-black text-white uppercase italic mb-8">
        {step === 1 && '1. Basic Information'}
        {step === 2 && '2. In-Game Profile'}
        {step === 3 && '3. Self Introduction'}
        {step === 4 && '4. Review & Submit'}
      </h2>

      {submitError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {!isAuthenticated && step === 1 && (
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0" />
          <span>You are not logged in. Please log in with Discord first to be able to apply.</span>
        </div>
      )}

      <div className="space-y-8 min-h-[400px]">
        {/* STEP 1: BASIC INFO */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Participation Type Toggle */}
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-3">Participation Type</label>
              <div className="flex gap-4">
                <button
                  onClick={() => setFormData({ ...formData, isLeader: true })}
                  className={`flex-1 py-4 border font-bold uppercase transition-all ${
                    formData.isLeader 
                      ? 'bg-[#FF4655] border-[#FF4655] text-white' 
                      : 'bg-[#111] border-[#333] text-gray-400 hover:border-gray-500'
                  }`}
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                  Team Leader
                </button>
                <button
                  onClick={() => setFormData({ ...formData, isLeader: false })}
                  className={`flex-1 py-4 border font-bold uppercase transition-all ${
                    !formData.isLeader 
                      ? 'bg-[#FF4655] border-[#FF4655] text-white' 
                      : 'bg-[#111] border-[#333] text-gray-400 hover:border-gray-500'
                  }`}
                  style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                  Team Member
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Riot ID (Name#Tag)</label>
              <input
                type="text"
                value={formData.riotId}
                onChange={e => setFormData({ ...formData, riotId: e.target.value })}
                className="w-full bg-[#111] border border-[#333] p-4 text-white focus:outline-none focus:border-[#FF4655] transition-colors uppercase font-mono"
                placeholder="PLAYER#KR1"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Discord Name / ID</label>
              <p className="text-xs text-gray-500 mb-2">Discord ID is loaded from OAuth2 dynamically. You can edit this field if needed.</p>
              <input
                type="text"
                value={formData.discordId}
                onChange={e => setFormData({ ...formData, discordId: e.target.value })}
                className="w-full bg-[#111] border border-[#333] p-4 text-white focus:outline-none focus:border-[#FF4655] transition-colors font-mono"
                placeholder="username#1234"
              />
            </div>
          </div>
        )}

        {/* STEP 2: GAME INFO */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-[#FF4655]" />
                <p className="uppercase font-bold tracking-widest text-sm">Fetching Valorant Data...</p>
              </div>
            ) : (
              <>
                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-bold text-gray-400 uppercase mb-3">Preferred Role</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {valorantData.roles.map((r) => {
                      const isSelected = formData.role === r.uuid;
                      return (
                        <button
                          key={r.uuid}
                          onClick={() => setFormData({ ...formData, role: r.uuid })}
                          className={`flex flex-col items-center p-4 border transition-all ${
                            isSelected 
                              ? 'bg-[#FF4655]/10 border-[#FF4655] text-[#FF4655]' 
                              : 'bg-[#111] border-[#333] text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          <img src={r.displayIcon} alt={r.displayName} className="w-8 h-8 mb-2 opacity-80" style={{ filter: isSelected ? 'brightness(0) saturate(100%) invert(43%) sepia(85%) saturate(3015%) hue-rotate(334deg) brightness(101%) contrast(101%)' : 'grayscale(100%) brightness(1.5)' }} />
                          <span className="text-xs font-bold uppercase">{r.displayName}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Agent Selection */}
                <div>
                  <label className="flex items-center justify-between text-sm font-bold text-gray-400 uppercase mb-3">
                    <span>Most Played Agents</span>
                    <span className={`${formData.agents.length === 3 ? 'text-[#FF4655]' : ''}`}>{formData.agents.length} / 3</span>
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                    {valorantData.agents.map((agent) => {
                      const isSelected = formData.agents.includes(agent.uuid);
                      return (
                        <button
                          key={agent.uuid}
                          onClick={() => toggleAgent(agent.uuid)}
                          disabled={!isSelected && formData.agents.length >= 3}
                          className={`relative aspect-square flex flex-col items-center justify-center p-1 border transition-all overflow-hidden ${
                            isSelected 
                              ? 'bg-[#FF4655]/20 border-[#FF4655] text-white' 
                              : 'bg-[#111] border-[#333] text-gray-400 hover:border-gray-500 disabled:opacity-30 disabled:cursor-not-allowed'
                          }`}
                        >
                          <img src={agent.displayIcon} alt={agent.displayName} className="w-10 h-10 object-contain mb-1" />
                          <span className="text-[9px] font-bold uppercase truncate w-full text-center">{agent.displayName}</span>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-2 h-2 bg-[#FF4655] rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tiers */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Current Tier</label>
                    <select
                      value={formData.currentTier}
                      onChange={e => setFormData({ ...formData, currentTier: e.target.value })}
                      className="w-full bg-[#111] border border-[#333] p-4 text-white focus:outline-none focus:border-[#FF4655] uppercase text-sm font-bold appearance-none"
                    >
                      <option value="" disabled>Select Tier</option>
                      {TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Peak Tier</label>
                    <select
                      value={formData.peakTier}
                      onChange={e => setFormData({ ...formData, peakTier: e.target.value })}
                      className="w-full bg-[#111] border border-[#333] p-4 text-white focus:outline-none focus:border-[#FF4655] uppercase text-sm font-bold appearance-none"
                    >
                      <option value="" disabled>Select Tier</option>
                      {TIERS.map(tier => <option key={tier} value={tier}>{tier}</option>)}
                    </select>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 3: INTRODUCTION */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300 h-full flex flex-col">
            <div className="flex-1">
              <label className="block text-sm font-bold text-gray-400 uppercase mb-2">Self Introduction (Max 50 lines)</label>
              <p className="text-xs text-gray-500 mb-4">Introduce yourself, your playstyle, and what you bring to the team. This will be visible to Team Leaders during the auction.</p>
              <textarea
                value={formData.introduction}
                onChange={e => setFormData({ ...formData, introduction: e.target.value })}
                className="w-full h-64 bg-[#111] border border-[#333] p-4 text-white focus:outline-none focus:border-[#FF4655] transition-colors resize-none"
                placeholder="Hello, I am a flex player who excels in..."
              />
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="bg-[#111] border border-[#333] p-6 space-y-6">
              
              <div className="flex items-center justify-between border-b border-[#333] pb-4">
                <div>
                  <span className="block text-xs text-gray-500 uppercase">Participation</span>
                  <span className="text-[#FF4655] font-black text-xl uppercase tracking-widest">
                    {formData.isLeader ? 'Team Leader' : 'Team Member'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-[#333] pb-4">
                <div>
                  <span className="block text-xs text-gray-500 uppercase">Riot ID</span>
                  <span className="text-white font-bold text-lg">{formData.riotId}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase">Discord ID</span>
                  <span className="text-white font-bold text-lg">{formData.discordId}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-b border-[#333] pb-4">
                <div>
                  <span className="block text-xs text-gray-500 uppercase">Role</span>
                  <span className="text-white font-bold text-lg uppercase flex items-center gap-2">
                    {selectedRoleName}
                  </span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase">Agents</span>
                  <span className="text-white font-bold">{selectedAgentNames}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-[#333] pb-4">
                <div>
                  <span className="block text-xs text-gray-500 uppercase">Current Tier</span>
                  <span className="text-white font-bold uppercase">{formData.currentTier}</span>
                </div>
                <div>
                  <span className="block text-xs text-gray-500 uppercase">Peak Tier</span>
                  <span className="text-white font-bold uppercase">{formData.peakTier}</span>
                </div>
              </div>

              <div>
                <span className="block text-xs text-gray-500 uppercase mb-2">Introduction</span>
                <p className="text-sm text-gray-300 whitespace-pre-wrap bg-[#1a1a1a] p-4 border border-[#333] h-32 overflow-y-auto">
                  {formData.introduction}
                </p>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer mt-6">
              <input type="checkbox" className="mt-1 w-4 h-4 bg-[#111] border-[#333] text-[#FF4655] rounded-none focus:ring-[#FF4655]" required />
              <span className="text-sm text-gray-400">
                I agree to the tournament rules and confirm that the information provided above is accurate. I understand that false information may result in disqualification.
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-[#333]">
        {step > 1 ? (
          <button
            onClick={handlePrev}
            disabled={isSubmitting}
            className="flex items-center text-gray-400 hover:text-white font-bold uppercase text-sm transition-colors disabled:opacity-50"
          >
            <ChevronLeft size={16} className="mr-1" /> Back
          </button>
        ) : (
          <div /> // Placeholder to align next button right
        )}

        {step < 4 ? (
          <button
            onClick={handleNext}
            disabled={
              (step === 1 && (!formData.riotId || !formData.discordId)) ||
              (step === 2 && (!formData.role || formData.agents.length === 0 || !formData.currentTier)) ||
              (step === 3 && !formData.introduction)
            }
            className="flex items-center bg-[#FF4655] text-white px-6 py-3 font-bold uppercase text-sm hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
          >
            Next Step <ChevronRight size={16} className="ml-1" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !user}
            className="flex items-center bg-[#FF4655] text-white px-8 py-3 font-bold uppercase text-sm hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
          >
            {isSubmitting ? (
              <>Submitting <Loader2 className="animate-spin ml-2 w-4 h-4" /></>
            ) : (
              <>Submit Application <Check size={16} className="ml-2" /></>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
