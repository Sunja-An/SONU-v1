import { useEffect, useState, useRef } from 'react';
import { useTranslation } from '../i18n';
import { NavBar } from '../components/common/NavBar';
import { Trophy, Calendar, Users, ChevronRight, ChevronLeft } from 'lucide-react';
import gsap from 'gsap';

// Dummy Data
const SLIDES = [
  {
    id: 1,
    title: 'VALORANT CHAMPIONS TOUR 2026',
    subtitle: '최고를 향한 여정, 지금 시작됩니다.',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=2070',
    date: '2026.07.01 - 2026.08.15',
  },
  {
    id: 2,
    title: 'SONU 내전 시즌 3',
    subtitle: '숨겨진 실력자들의 치열한 승부',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071',
    date: '2026.06.20 - 2026.06.30',
  },
  {
    id: 3,
    title: '루키즈 컵 (Rookies Cup)',
    subtitle: '새로운 전설의 시작',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=2070',
    date: '2026.09.05 - 2026.09.12',
  }
];

const TOURNAMENTS = [
  {
    id: 101,
    title: '제 4회 SONU 멸망전',
    status: 'recruiting', // recruiting, ongoing, completed
    teams: '6/8',
    date: '2026.06.15',
    prize: '1,000,000 KRW',
  },
  {
    id: 102,
    title: 'VALORANT 직장인 토너먼트',
    status: 'ongoing',
    teams: '16/16',
    date: '2026.06.01 - 06.30',
    prize: '커스텀 키보드 세트',
  },
  {
    id: 103,
    title: '스트리머 대난투',
    status: 'completed',
    teams: '8/8',
    date: '2026.05.20',
    prize: '명예와 자존심',
  },
  {
    id: 104,
    title: '심야 솔랭 전사 모임',
    status: 'recruiting',
    teams: '2/4',
    date: '2026.06.25',
    prize: '치킨 기프티콘',
  },
];

export function TournamentList() {
  const { t, lang } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef<HTMLDivElement>(null);
  
  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Animate slide text on change
  useEffect(() => {
    if (slideRef.current) {
      const elements = slideRef.current.querySelectorAll('.slide-anim');
      gsap.fromTo(elements, 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [currentSlide]);

  const nextSlide = () => setCurrentSlide((p) => (p + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((p) => (p - 1 + SLIDES.length) % SLIDES.length);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'recruiting': return 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10';
      case 'ongoing': return 'text-[#FF4655] border-[#FF4655]/30 bg-[#FF4655]/10';
      case 'completed': return 'text-slate-400 border-slate-700 bg-slate-800/50';
      default: return 'text-slate-400 border-slate-700 bg-slate-800/50';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'recruiting': return t.tournaments.status.recruiting;
      case 'ongoing': return t.tournaments.status.ongoing;
      case 'completed': return t.tournaments.status.completed;
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b0f] text-[#f1f5f9]">
      <NavBar />

      <main className="pt-16">
        {/* ── Slider Banner ──────────────────────── */}
        <section className="relative w-full h-[60vh] min-h-[400px] max-h-[600px] bg-slate-900 overflow-hidden group">
          {SLIDES.map((slide, idx) => (
            <div 
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {/* Background Image with Overlay */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a0b0f] via-[#0a0b0f]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0b0f] via-transparent to-transparent" />

              {/* Content */}
              <div ref={idx === currentSlide ? slideRef : null} className="absolute inset-0 flex items-center">
                <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12">
                  <div className="max-w-2xl">
                    <div className="slide-anim inline-block px-3 py-1 border border-[#FF4655]/30 bg-[#FF4655]/10 text-[#FF4655] text-xs font-bold tracking-widest mb-4">
                      FEATURED TOURNAMENT
                    </div>
                    <h2 className="slide-anim text-4xl md:text-6xl font-black tracking-tight mb-4 uppercase" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                      {slide.title}
                    </h2>
                    <p className="slide-anim text-lg md:text-xl text-slate-300 mb-6 font-medium">
                      {slide.subtitle}
                    </p>
                    <div className="slide-anim flex items-center gap-4 text-sm text-slate-400 font-mono bg-black/40 inline-flex px-4 py-2 border border-white/5 backdrop-blur-sm">
                      <Calendar size={16} className="text-[#FF4655]" />
                      <span>{slide.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Slider Controls */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/50 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF4655] hover:border-[#FF4655]"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 flex items-center justify-center bg-black/50 text-white border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#FF4655] hover:border-[#FF4655]"
          >
            <ChevronRight size={24} />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 transition-all duration-300 ${idx === currentSlide ? 'w-8 bg-[#FF4655]' : 'w-4 bg-white/30 hover:bg-white/50'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        {/* ── Tournament Grid ──────────────────────── */}
        <section className="max-w-[1200px] mx-auto px-6 md:px-12 py-20">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-1 bg-[#FF4655]" />
                <h3 className="text-[#FF4655] text-xs font-bold tracking-[0.2em] uppercase font-mono">Tournaments</h3>
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight">{t.tournaments.title}</h2>
              <p className="text-slate-400 mt-2">{t.tournaments.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOURNAMENTS.map((tournament) => (
              <div 
                key={tournament.id}
                className="group relative bg-[#0f1117] border border-white/5 hover:border-[#FF4655]/30 transition-colors duration-300 flex flex-col h-full"
              >
                {/* Accent line on hover */}
                <div className="absolute top-0 left-0 w-0 h-0.5 bg-[#FF4655] group-hover:w-full transition-all duration-500 ease-out" />
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`text-[11px] px-2.5 py-1 font-bold tracking-wider uppercase border ${getStatusColor(tournament.status)}`}>
                      {getStatusText(tournament.status)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-4 group-hover:text-[#FF4655] transition-colors line-clamp-2">
                    {tournament.title}
                  </h3>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Calendar size={16} className="text-slate-500" />
                      <span>{tournament.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Users size={16} className="text-slate-500" />
                      <span>{tournament.teams} Teams</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <Trophy size={16} className="text-[#FF4655]/70" />
                      <span className="text-slate-300">{tournament.prize}</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 border-t border-white/5 flex items-center justify-center gap-2 text-sm font-semibold tracking-wider text-slate-400 group-hover:text-white group-hover:bg-white/5 transition-colors">
                  {t.tournaments.viewDetails}
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
