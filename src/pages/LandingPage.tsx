import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../i18n';
import { LogIn } from 'lucide-react';

export function LandingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState(false);

  const navigate = useNavigate();
  const { lang } = useTranslation();
  const { login } = useAuthStore();

  const handleDiscordLogin = () => {
    const code = inviteCode.trim();
    // 보안을 위해 기존 코드를 변경했습니다. 필요시 변경해 사용하세요.
    if (!['SONU_PLAYER_99X', 'SONU_LEADER_77Y', 'SONU_AUCTION_55Z'].includes(code)) {
      setError(true);
      return;
    }
    setError(false);

    // Mocking Discord OAuth login success
    // 추후 API 연동 시 분기 처리 예정
    login({
      id: '1234567890',
      username: 'ShadowAgent',
      discriminator: '0001',
      avatarUrl: 'https://cdn.discordapp.com/embed/avatars/0.png'
    }, 'mock_token');

    setIsAnimatingOut(true);
    
    // Wait for exit animation to complete before navigating
    setTimeout(() => {
      if (code === 'SONU_PLAYER_99X') {
        navigate(`/${lang}/profile`); // 등록된 유저 정보 페이지
      } else if (code === 'SONU_LEADER_77Y') {
        navigate(`/${lang}/leader-register`); // 팀장 등록 페이지
      } else if (code === 'SONU_AUCTION_55Z') {
        navigate(`/${lang}/auction`); // 경매장 페이지
      }
    }, 1000);
  };

  return (
    <div className="relative min-h-screen bg-[#0a0b0f] flex items-center justify-center overflow-hidden font-sans">
      {/* Background Cyberpunk Styling */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(255, 70, 85, 0.15) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(241, 245, 249, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(241, 245, 249, 1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <AnimatePresence>
        {!isAnimatingOut && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md px-4"
          >
            {/* The Invitation Card */}
            <motion.div 
              className="bg-[#0f1117] border border-[#ff4655]/30 p-8 md:p-10 relative overflow-hidden shadow-[0_0_40px_rgba(255,70,85,0.1)]"
              animate={isOpen ? { height: 'auto', paddingBottom: '40px' } : {}}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-8 h-0.5 bg-[#FF4655]" />
              <div className="absolute top-0 left-0 w-0.5 h-8 bg-[#FF4655]" />
              <div className="absolute bottom-0 right-0 w-8 h-0.5 bg-[#FF4655]" />
              <div className="absolute bottom-0 right-0 w-0.5 h-8 bg-[#FF4655]" />

              <div className="text-center">
                <motion.div
                  initial={{ opacity: 1 }}
                  animate={isOpen ? { opacity: 0, height: 0, marginBottom: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-20 h-20 mx-auto flex items-center justify-center mb-6">
                    <img src="/logo.svg" alt="SONU Logo" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,70,85,0.4)]" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-widest text-[#f1f5f9] mb-2 uppercase">極秘の招待状</h1>
                  <p className="text-[#f1f5f9]/50 text-sm mb-8 tracking-wider">選ばれたエージェントのみアクセス可能。</p>
                  
                  <button
                    onClick={() => setIsOpen(true)}
                    className="w-full py-4 border border-[#FF4655]/50 text-[#FF4655] uppercase tracking-widest text-sm hover:bg-[#FF4655]/10 transition-colors"
                  >
                    招待状を開く
                  </button>
                </motion.div>

                {/* Opened State Content */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <div className="mb-8">
                        <div className="inline-block px-3 py-1 bg-[#FF4655]/20 text-[#FF4655] text-xs tracking-[0.2em] mb-6 uppercase">
                          極秘
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-[#f1f5f9] mb-4">「一緒に遊ばないか。」</h2>
                        <p className="text-[#f1f5f9]/70 text-sm leading-relaxed mb-6 font-mono text-left">
                          &gt; プロトコル開始...<br/>
                          &gt; ターゲット確認。<br/>
                          &gt; VALORANT カスタムトーナメント。<br/><br/>
                          部隊を集めよ。実力を証明せよ。オークションが待っている。
                        </p>
                      </div>

                      <div className="mb-6 relative">
                        <input
                          type="text"
                          value={inviteCode}
                          onChange={(e) => {
                            setInviteCode(e.target.value.toUpperCase());
                            setError(false);
                          }}
                          placeholder="入場コードを入力"
                          className={`w-full bg-black/40 border ${
                            error ? 'border-red-500 text-red-500' : 'border-white/20 text-white focus:border-[#FF4655]'
                          } p-4 text-center tracking-[0.3em] font-mono focus:outline-none transition-colors shadow-inner`}
                        />
                        {error && (
                          <motion.p 
                            initial={{ opacity: 0, y: -5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className="absolute -bottom-5 left-0 w-full text-red-500 text-[10px] text-center mt-1 font-bold tracking-widest"
                          >
                            アクセス拒否：無効なコード
                          </motion.p>
                        )}
                      </div>

                      <button
                        onClick={handleDiscordLogin}
                        className="w-full flex items-center justify-center gap-3 bg-[#5865F2] hover:bg-[#4752C4] text-white py-4 px-6 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98] relative group overflow-hidden"
                        style={{
                          clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))'
                        }}
                      >
                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <LogIn size={20} className="relative z-10" />
                        <span className="relative z-10 tracking-widest text-sm uppercase">Discordでログイン</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
