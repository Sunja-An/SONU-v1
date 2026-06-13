import { useTranslation } from '../i18n';
import { NavBar } from '../components/common/NavBar';

export function Login() {
  const { t, lang } = useTranslation();

  const handleDiscordLogin = () => {
    // In a real application, this would redirect to your backend's OAuth endpoint
    // window.location.href = '/api/auth/discord/login';
    alert('Discord OAuth2 Login flow initiated.');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0b0f] text-[#f1f5f9] overflow-hidden relative">
      <NavBar />
      
      {/* Background visual elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
          style={{
            background: 'radial-gradient(circle, rgba(88, 101, 242, 0.08) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute top-0 right-0 w-full h-full opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(241, 245, 249, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(241, 245, 249, 1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <main className="flex-1 flex items-center justify-center relative z-10 px-4 mt-16">
        <div className="w-full max-w-md bg-[#0f1117] border border-white/10 p-8 relative">
          {/* Top-left corner accent */}
          <div className="absolute top-0 left-0 w-8 h-0.5 bg-[#5865F2]" />
          <div className="absolute top-0 left-0 w-0.5 h-8 bg-[#5865F2]" />
          
          {/* Bottom-right corner accent */}
          <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-[#5865F2]" />
          <div className="absolute bottom-0 right-0 w-0.5 h-8 bg-[#5865F2]" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-[#5865F2]/10 rounded-full mb-4">
              <svg width="24" height="24" viewBox="0 0 127.14 96.36" fill="#5865F2">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight mb-2">{t.login.title}</h1>
            <p className="text-sm text-slate-400">
              {t.login.subtitle}
            </p>
          </div>

          <button
            onClick={handleDiscordLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white py-3.5 px-6 font-semibold transition-colors relative group overflow-hidden"
            style={{
              clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
            }}
          >
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <svg className="relative z-10" width="20" height="20" viewBox="0 0 127.14 96.36" fill="currentColor">
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.31,60,73.31,53s5-12.74,11.43-12.74S96.33,46,96.22,53,91.08,65.69,84.69,65.69Z"/>
            </svg>
            <span className="relative z-10 tracking-wider text-sm">{t.login.discordBtn}</span>
          </button>

          <div className="mt-8 text-center">
            <a 
              href={`/${lang}`}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
            >
              ← {t.login.backToHome}
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
