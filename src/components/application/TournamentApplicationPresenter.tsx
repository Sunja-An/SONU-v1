import React, { useEffect, useRef } from 'react';
import { Calendar, Trophy, Users, AlertCircle, Loader2, Check, Lock, ChevronRight, ChevronLeft, Info, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// ==========================================
// Props Interfaces
// ==========================================
export interface TournamentDetails {
  id: string;
  title: string;
  subtitle: string;
  prize: string;
  date: string;
  slots: string;
  bgImage: string;
  rules?: string[];
}

export interface UserProfile {
  id: string | number;
  username: string;
  discriminator?: string;
  avatarUrl: string;
  nickname?: string;
}

export interface ApplicationFormData {
  isLeader: boolean;
  riotId: string;
  discordId: string;
  role: string; // role uuid
  agents: string[]; // agent uuids
  currentTier: string;
  peakTier: string;
  introduction: string;
}

export interface RegisteredDetails {
  isLeader: boolean;
  riotId: string;
  discordId: string;
  roleName: string;
  roleIcon: string;
  agents: { displayName: string; displayIcon: string }[];
  currentTier: string;
  peakTier: string;
  introduction: string;
}

export interface TournamentApplicationPresenterProps {
  tournament: TournamentDetails;
  user: UserProfile | null;
  isAuthenticated: boolean;
  valorantAgents: { uuid: string; displayName: string; displayIcon: string }[];
  valorantRoles: { uuid: string; displayName: string; displayIcon: string }[];
  isValorantLoading: boolean;
  formData: ApplicationFormData;
  onFormChange: (field: keyof ApplicationFormData, value: any) => void;
  onAgentToggle: (agentUuid: string) => void;
  isSubmitting: boolean;
  submitError: string | null;
  isRegistered: boolean;
  registeredDetails: RegisteredDetails | null;
  onLoginClick: () => void;
  tiers: string[];
  
  // Step & Modal states passed from Container
  activeStep: number;
  onStepChange: (step: number) => void;
  isModalOpen: boolean;
  onCloseModal: () => void;
  inviteCode: string;
  onInviteCodeChange: (code: string) => void;
  onOpenModal: (e: React.FormEvent) => void;
  onConfirmSubmit: (e: React.FormEvent) => void;
  inviteCodeError: string | null;
}

export const TournamentApplicationPresenter: React.FC<TournamentApplicationPresenterProps> = ({
  tournament,
  user: _user,
  isAuthenticated,
  valorantAgents,
  valorantRoles,
  isValorantLoading,
  formData,
  onFormChange,
  onAgentToggle,
  isSubmitting,
  submitError,
  isRegistered,
  registeredDetails: _registeredDetails,
  onLoginClick,
  tiers,
  
  activeStep,
  onStepChange,
  isModalOpen,
  onCloseModal,
  inviteCode,
  onInviteCodeChange,
  onOpenModal,
  onConfirmSubmit,
  inviteCodeError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<HTMLDivElement>(null);

  // GSAP Horizontal Scroll Setup (Responsive MatchMedia)
  useEffect(() => {
    const container = containerRef.current;
    const sections = sectionsRef.current;
    
    if (!container || !sections) return;

    const mm = gsap.matchMedia();

    // Standard GSAP horizontal pinning layout only for screens >= 768px (Desktop)
    mm.add("(min-width: 768px)", () => {
      const panels = gsap.utils.toArray('.scroll-panel');
      gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 0.5,
          start: 'top top',
          end: () => `+=${sections.offsetWidth}`,
          invalidateOnRefresh: true,
        }
      });
    });

    return () => mm.revert(); // revert GSAP matchMedia to prevent memory leak
  }, []);

  return (
    <div className="min-h-screen bg-[#06070b] text-[#f1f5f9] font-sans overflow-x-hidden selection:bg-[#FF4655] selection:text-white">
      
      {/* ──────────────────────────────────────────────────────────
          SECTION 1: TOURNAMENT DESCRIPTION (GSAP Horizontal Scroll)
          ────────────────────────────────────────────────────────── */}
      <section ref={containerRef} className="relative w-full min-h-screen md:h-screen overflow-y-auto md:overflow-hidden bg-[#06070b] border-b border-white/5">
        <div ref={sectionsRef} className="flex flex-col md:flex-row h-auto md:h-full w-full md:w-[300vw]">
          
          {/* PANEL 1: Overview Banner */}
          <div className="scroll-panel w-full md:w-screen h-auto min-h-[60vh] md:h-full flex-shrink-0 relative flex items-center justify-center py-20 md:py-0 px-8">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none scale-105"
              style={{ backgroundImage: `url(${tournament.bgImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#06070b] via-transparent to-[#06070b] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070b] via-transparent to-transparent pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl text-center flex flex-col items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FF4655]/15 border border-[#FF4655]/40 text-[#FF4655] text-[10px] font-black uppercase tracking-[0.2em] mb-6 font-mono">
                <span className="w-1.5 h-1.5 bg-[#FF4655] rounded-full animate-ping" />
                Section 1 // Overview
              </span>
              <h1 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter text-white mb-6 select-none leading-none">
                {tournament.title}
              </h1>
              <p className="text-sm md:text-lg text-gray-300 font-medium tracking-wide max-w-2xl mb-8 leading-relaxed">
                {tournament.subtitle}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                <span className="hidden md:inline">SCROLL DOWN TO EXPLORE</span>
                <span className="md:hidden">SCROLL DOWN OR SWIPE TO EXPLORE</span>
                <span className="animate-bounce">↓</span>
              </div>
            </div>
          </div>

          {/* PANEL 2: Prizes & Logistics */}
          <div className="scroll-panel w-full md:w-screen h-auto min-h-[60vh] md:h-full flex-shrink-0 relative flex items-center justify-center py-20 md:py-0 px-8 bg-[#090a0f]">
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
              style={{
                backgroundImage: `linear-gradient(rgba(241, 245, 249, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(241, 245, 249, 0.3) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
            <div className="relative z-10 max-w-4xl w-full">
              <div className="text-center mb-10">
                <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 font-mono">
                  Section 1 // Details
                </span>
                <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-white">
                  TOURNAMENT LOGISTICS
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0e1017] border border-white/5 p-6 relative hover:border-[#FF4655]/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-2 h-0.5 bg-[#FF4655]" />
                  <div className="absolute top-0 left-0 w-0.5 h-2 bg-[#FF4655]" />
                  <Trophy className="text-[#FF4655] mb-4" size={32} />
                  <span className="block text-[9px] text-gray-500 uppercase font-black tracking-widest font-mono mb-1">Prize Pool</span>
                  <span className="font-bold text-lg text-white font-mono">{tournament.prize}</span>
                </div>

                <div className="bg-[#0e1017] border border-white/5 p-6 relative hover:border-[#FF4655]/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-2 h-0.5 bg-[#FF4655]" />
                  <div className="absolute top-0 left-0 w-0.5 h-2 bg-[#FF4655]" />
                  <Calendar className="text-[#FF4655] mb-4" size={32} />
                  <span className="block text-[9px] text-gray-500 uppercase font-black tracking-widest font-mono mb-1">Schedule</span>
                  <span className="font-bold text-lg text-white font-mono">{tournament.date}</span>
                </div>

                <div className="bg-[#0e1017] border border-white/5 p-6 relative hover:border-[#FF4655]/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-2 h-0.5 bg-[#FF4655]" />
                  <div className="absolute top-0 left-0 w-0.5 h-2 bg-[#FF4655]" />
                  <Users className="text-[#FF4655] mb-4" size={32} />
                  <span className="block text-[9px] text-gray-500 uppercase font-black tracking-widest font-mono mb-1">Capacity</span>
                  <span className="font-bold text-lg text-white font-mono">{tournament.slots}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PANEL 3: Rules & Guidelines */}
          <div className="scroll-panel w-full md:w-screen h-auto min-h-[60vh] md:h-full flex-shrink-0 relative flex items-center justify-center py-20 md:py-0 px-8">
            <div className="relative z-10 max-w-3xl w-full bg-[#0d0f15]/80 backdrop-blur border border-white/10 p-8">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#FF4655]" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#FF4655]" />
              
              <div className="flex items-center gap-2 mb-6">
                <Info size={20} className="text-[#FF4655]" />
                <h3 className="text-lg font-black uppercase text-white tracking-widest font-mono">MATCH RULES & PROTOCOLS</h3>
              </div>

              <div className="space-y-4 text-xs md:text-sm text-gray-400">
                <div className="flex gap-3 items-start">
                  <span className="text-[#FF4655] font-bold">01/</span>
                  <p>이 대회는 참가 선수의 랭크 및 포지션을 토대로 공정하고 치열한 팀 매칭을 지원합니다.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-[#FF4655] font-bold">02/</span>
                  <p>신청서 제출 시 본인의 실명 정보(Riot ID) 및 Discord 연락처를 필수로 기재해야 합니다.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-[#FF4655] font-bold">03/</span>
                  <p>선수 옥션이 함께 매치되어 팀장들은 보유한 예산 포인트를 통해 드래프트를 완료하게 됩니다.</p>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-[#FF4655] font-bold">04/</span>
                  <p>참가 후, 최종 매치 현황은 등록 이후 생성될 **Contests** 대시보드를 통해 실시간 트랙킹이 가능합니다.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────
          SECTION 2: APPLICATION FORM (4 STEP Wizard Layout)
          ────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 bg-gradient-to-b from-[#06070b] via-[#090b10] to-[#06070b] border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-2 font-mono">
              <div className="w-1.5 h-1.5 bg-[#FF4655]" />
              <span className="text-xs text-[#FF4655] uppercase font-bold tracking-widest">Section 02</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight text-white">
              Player Application Form
            </h2>
            <p className="text-gray-400 mt-2 max-w-xl mx-auto text-sm">
              {isRegistered 
                ? '이미 대회의 참가 신청이 접수되었습니다. 대회 대시보드(Contests)를 확인해 주세요.'
                : '대회 참가 신청서를 접수해 주세요. 4단계 다단계 폼으로 구성되어 있습니다.'
              }
            </p>
          </div>

          {submitError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
              <AlertCircle size={18} className="shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {!isAuthenticated ? (
            /* Login Lock State */
            <div className="relative border border-white/5 bg-[#0e1017] p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
              <div className="relative z-10">
                <Lock size={36} className="text-[#FF4655] mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white uppercase mb-2">Authentication Required</h3>
                <p className="text-gray-400 text-xs mb-6 max-w-xs mx-auto">
                  대회 신청을 계속하려면 디스코드 로그인을 완료해 주셔야 합니다.
                </p>
                <button
                  onClick={onLoginClick}
                  className="px-6 py-3 bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold tracking-widest uppercase transition-all flex items-center gap-2 mx-auto"
                  style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                >
                  <Lock size={12} /> Discord 로그인
                </button>
              </div>
            </div>
          ) : isRegistered ? (
            /* Registered Placeholder */
            <div className="border border-white/5 bg-[#0e1017]/40 p-12 text-center flex flex-col items-center justify-center min-h-[200px] relative">
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00FF9D]/30" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00FF9D]/30" />
              <div className="w-10 h-10 bg-[#00FF9D]/15 rounded-full flex items-center justify-center text-[#00FF9D] mb-4">
                <Check size={20} />
              </div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider mb-1">참가 신청 접수 완료</h3>
              <p className="text-gray-400 text-xs max-w-sm">
                신청서가 완료되었습니다. **대회 대시보드(Contests)**를 방문해 주세요.
              </p>
            </div>
          ) : (
            /* 4-Step Form Panel */
            <div className="bg-[#0e1017] border border-white/10 p-6 md:p-10 relative">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#FF4655]" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#FF4655]" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#FF4655]" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#FF4655]" />

              {/* Progress Indicator */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5 font-mono">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <button
                      type="button"
                      disabled={step > activeStep} // can't skip ahead without validation
                      onClick={() => onStepChange(step)}
                      className={`w-7 h-7 flex items-center justify-center text-xs font-bold border transition-colors ${
                        activeStep === step
                          ? 'bg-[#FF4655] border-[#FF4655] text-white'
                          : activeStep > step
                          ? 'border-[#FF4655]/45 text-[#FF4655] hover:bg-[#FF4655]/10'
                          : 'border-white/10 text-gray-500 cursor-not-allowed'
                      }`}
                      style={{ clipPath: 'polygon(15% 0, 100% 0, 85% 100%, 0 100%)' }}
                    >
                      {step}
                    </button>
                    {step < 4 && (
                      <div className={`w-8 md:w-16 h-0.5 mx-2 ${
                        activeStep > step ? 'bg-[#FF4655]/50' : 'bg-white/10'
                      }`} />
                    )}
                  </div>
                ))}
                <span className="text-[10px] text-[#FF4655] font-black uppercase tracking-widest">
                  Step {activeStep} of 4
                </span>
              </div>

              {/* Form Content Steps */}
              <div className="min-h-[250px] flex flex-col justify-between">
                
                {/* STEP 1: Basic Identity */}
                {activeStep === 1 && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#FF4655] font-mono">01. PLAYER IDENTITY</h3>
                    
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Role Type</label>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => onFormChange('isLeader', true)}
                          className={`flex-1 py-3 border text-xs font-bold uppercase transition-all tracking-wider ${
                            formData.isLeader 
                              ? 'bg-[#FF4655] border-[#FF4655] text-white' 
                              : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                        >
                          Team Leader
                        </button>
                        <button
                          type="button"
                          onClick={() => onFormChange('isLeader', false)}
                          className={`flex-1 py-3 border text-xs font-bold uppercase transition-all tracking-wider ${
                            !formData.isLeader 
                              ? 'bg-[#FF4655] border-[#FF4655] text-white' 
                              : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                          }`}
                          style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                        >
                          Team Member
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Riot ID (Name#Tag)</label>
                        <input
                          type="text"
                          required
                          value={formData.riotId}
                          onChange={e => onFormChange('riotId', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-3 text-white font-mono text-xs focus:outline-none focus:border-[#FF4655] uppercase"
                          placeholder="SOVA#KR1"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Discord ID</label>
                        <input
                          type="text"
                          required
                          value={formData.discordId}
                          onChange={e => onFormChange('discordId', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-3 text-white font-mono text-xs focus:outline-none focus:border-[#FF4655]"
                          placeholder="username_discord"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Role and Agents */}
                {activeStep === 2 && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#FF4655] font-mono">02. POSITION & AGENTS</h3>
                    
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Preferred Position</label>
                      <div className="grid grid-cols-4 gap-2">
                        {valorantRoles.map((role) => {
                          const isSelected = formData.role === role.uuid;
                          return (
                            <button
                              key={role.uuid}
                              type="button"
                              onClick={() => onFormChange('role', role.uuid)}
                              className={`flex flex-col items-center justify-center p-2 border transition-all ${
                                isSelected
                                  ? 'bg-[#FF4655]/15 border-[#FF4655] text-[#FF4655]'
                                  : 'bg-black/40 border-white/10 text-gray-400 hover:border-white/20'
                              }`}
                            >
                              <img src={role.displayIcon} alt={role.displayName} className="w-5 h-5 mb-1 opacity-80" />
                              <span className="text-[8px] font-bold uppercase truncate w-full text-center">{role.displayName}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider">Most Played Agents (Max 3)</label>
                        <span className="text-[9px] text-gray-500 font-mono">{formData.agents.length} / 3 Selected</span>
                      </div>
                      
                      {isValorantLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <Loader2 className="w-5 h-5 animate-spin text-[#FF4655]" />
                        </div>
                      ) : (
                        <div className="grid grid-cols-6 gap-1.5 max-h-[110px] overflow-y-auto pr-1 select-scrollbar">
                          {valorantAgents.map((agent) => {
                            const isSelected = formData.agents.includes(agent.uuid);
                            const isDisabled = !isSelected && formData.agents.length >= 3;
                            return (
                              <button
                                key={agent.uuid}
                                type="button"
                                onClick={() => onAgentToggle(agent.uuid)}
                                disabled={isDisabled}
                                className={`relative aspect-square flex flex-col items-center justify-center border transition-all p-1 ${
                                  isSelected
                                    ? 'bg-[#FF4655]/15 border-[#FF4655] text-white'
                                    : 'bg-black/40 border-white/10 hover:border-white/20 disabled:opacity-20'
                                }`}
                              >
                                <img src={agent.displayIcon} alt={agent.displayName} className="w-6 h-6 object-contain mb-0.5" />
                                <span className="text-[7px] font-bold uppercase truncate w-full text-center text-gray-400">{agent.displayName}</span>
                                {isSelected && <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-[#FF4655]" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: Tiers */}
                {activeStep === 3 && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#FF4655] font-mono">03. RANK DETAILS</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Current Rank</label>
                        <select
                          required
                          value={formData.currentTier}
                          onChange={e => onFormChange('currentTier', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-[#FF4655] transition-colors text-xs font-bold"
                        >
                          <option value="" disabled className="bg-[#0e1017]">SELECT CURRENT TIER</option>
                          {tiers.map(t => <option key={t} value={t} className="bg-[#0e1017]">{t}</option>)}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Peak Rank</label>
                        <select
                          required
                          value={formData.peakTier}
                          onChange={e => onFormChange('peakTier', e.target.value)}
                          className="w-full bg-black/40 border border-white/10 p-3 text-white focus:outline-none focus:border-[#FF4655] transition-colors text-xs font-bold"
                        >
                          <option value="" disabled className="bg-[#0e1017]">SELECT PEAK TIER</option>
                          {tiers.map(t => <option key={t} value={t} className="bg-[#0e1017]">{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 4: Intro & Verification Modal Hook */}
                {activeStep === 4 && (
                  <div className="space-y-5">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#FF4655] font-mono">04. FINAL SUBMISSION</h3>
                    
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Self Introduction (Max 100 Chars)</label>
                      <textarea
                        required
                        value={formData.introduction}
                        onChange={e => onFormChange('introduction', e.target.value)}
                        className="w-full h-[90px] bg-black/40 border border-white/10 p-3 text-white text-xs focus:outline-none focus:border-[#FF4655] resize-none"
                        placeholder="자신의 장점과 팀 매칭을 위한 전략적 플레이스타일을 적어주세요."
                        maxLength={100}
                      />
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input 
                        type="checkbox" 
                        required 
                        className="mt-0.5 w-3.5 h-3.5 bg-black/40 border-white/10 text-[#FF4655] rounded-none focus:ring-[#FF4655]" 
                      />
                      <span className="text-[10px] text-gray-500 leading-normal">
                        참가 규칙 및 라이엇 ID 제공에 동의하며, 초대 코드 검증 단계로 넘어감을 승인합니다.
                      </span>
                    </label>
                  </div>
                )}

                {/* Wizard Controls */}
                <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
                  {activeStep > 1 ? (
                    <button
                      type="button"
                      onClick={() => onStepChange(activeStep - 1)}
                      className="flex items-center text-xs text-gray-400 hover:text-white font-bold uppercase transition-colors"
                    >
                      <ChevronLeft size={14} className="mr-1" /> Previous Step
                    </button>
                  ) : (
                    <div />
                  )}

                  {activeStep < 4 ? (
                    <button
                      type="button"
                      onClick={() => {
                        // Basic Step validations
                        if (activeStep === 1 && (!formData.riotId || !formData.discordId)) return;
                        if (activeStep === 2 && (!formData.role || formData.agents.length === 0)) return;
                        if (activeStep === 3 && (!formData.currentTier || !formData.peakTier)) return;
                        onStepChange(activeStep + 1);
                      }}
                      disabled={
                        (activeStep === 1 && (!formData.riotId || !formData.discordId)) ||
                        (activeStep === 2 && (!formData.role || formData.agents.length === 0)) ||
                        (activeStep === 3 && (!formData.currentTier || !formData.peakTier))
                      }
                      className="flex items-center bg-[#FF4655] text-white px-5 py-2.5 text-xs font-bold uppercase hover:bg-white hover:text-black transition-all disabled:opacity-40"
                      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                      Next Step <ChevronRight size={14} className="ml-1" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenModal}
                      disabled={!formData.riotId || !formData.role || formData.agents.length === 0 || !formData.currentTier || !formData.introduction}
                      className="flex items-center bg-[#FF4655] text-white px-6 py-2.5 text-xs font-black uppercase hover:bg-white hover:text-black transition-all disabled:opacity-40"
                      style={{ clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)' }}
                    >
                      Verify & Register <Check size={14} className="ml-1.5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </section>



      {/* ──────────────────────────────────────────────────────────
          INVITATION CODE VERIFICATION MODAL
          ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Modal Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseModal}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md bg-[#0f1118] border border-[#FF4655]/40 p-8 shadow-[0_0_50px_rgba(255,70,85,0.15)] z-10"
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-4 h-0.5 bg-[#FF4655]" />
              <div className="absolute top-0 left-0 w-0.5 h-4 bg-[#FF4655]" />
              <div className="absolute bottom-0 right-0 w-4 h-0.5 bg-[#FF4655]" />
              <div className="absolute bottom-0 right-0 w-0.5 h-4 bg-[#FF4655]" />

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-[#FF4655]/10 border border-[#FF4655]/40 flex items-center justify-center mx-auto mb-4 text-[#FF4655]">
                  <HelpCircle size={24} />
                </div>
                <h3 className="text-lg font-black uppercase text-white tracking-widest">Verification Required</h3>
                <p className="text-gray-400 text-xs mt-2">
                  최종 참가 접수를 위해 제공 받으신 **초대 코드**를 입력해 주십시오. (코드: FAKEINFO)
                </p>
              </div>

              <form onSubmit={onConfirmSubmit} className="space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={inviteCode}
                    onChange={(e) => onInviteCodeChange(e.target.value.toUpperCase())}
                    placeholder="ENTER INVITATION CODE"
                    className={`w-full bg-black/40 border ${
                      inviteCodeError ? 'border-red-500 text-red-500' : 'border-white/20 text-white focus:border-[#FF4655]'
                    } p-3.5 text-center tracking-[0.2em] font-mono text-sm focus:outline-none focus:ring-0 uppercase`}
                  />
                  {inviteCodeError && (
                    <span className="block text-red-400 text-[10px] text-center mt-2 font-mono font-bold">
                      {inviteCodeError}
                    </span>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={onCloseModal}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-bold uppercase transition-all tracking-wider"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !inviteCode}
                    className="flex-1 py-3 bg-[#FF4655] hover:bg-white hover:text-black text-white text-xs font-black uppercase transition-all tracking-wider flex items-center justify-center gap-1.5"
                    style={{ clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)' }}
                  >
                    {isSubmitting ? (
                      <>
                        Submitting
                        <Loader2 className="animate-spin w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        Verify Code
                        <Check size={12} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
