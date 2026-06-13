import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useTranslation } from '../../i18n';
import { LangSwitcher } from './LangSwitcher';
import { useWindowWidth } from '../../hooks/useWindowWidth';

interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface NavBarProps {
  onEnter?: () => void;
  items?: NavItem[];
}

export function NavBar({ onEnter, items }: NavBarProps) {
  const navRef = useRef<HTMLElement>(null);
  const { t, lang } = useTranslation();
  const width = useWindowWidth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = width < 768;
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -60, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }, []);

  useEffect(() => {
    if (!isMobile) setMenuOpen(false);
  }, [isMobile]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Default nav items if not provided
  const navItems = items || [
    { label: t.landing.nav.system, href: `/${lang}#section-1` },
    { label: t.landing.nav.features, href: `/${lang}#section-2` },
    { label: t.landing.nav.team, href: `/${lang}#section-3` },
    { label: t.landing.nav.tournaments, href: `/${lang}/tournaments` },
  ];

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    
    // If it's a hash link on the same page
    if (href.includes('#') && location.pathname === href.split('#')[0]) {
      setTimeout(() => {
        const id = href.split('#')[1];
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      // Navigate to another page
      navigate(href);
    }
  };

  const handleLoginClick = () => {
    navigate(`/${lang}/login`);
  };

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: isMobile ? '0 20px' : '0 48px',
          height: '64px',
          background: 'rgba(10,11,15,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,70,85,0.15)',
        }}
      >
        {/* Logo */}
        <div 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate(`/${lang}`)}
        >
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              background: '#FF4655',
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '14px',
              fontWeight: 700,
              color: '#f1f5f9',
              letterSpacing: '0.1em',
            }}
          >
            SONU<span style={{ color: '#FF4655' }}>{t.landing.hero.title2}</span>
          </span>
        </div>

        {/* Desktop: Right items */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => handleNavClick(item.href)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(241,245,249,0.6)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  transition: 'color 0.2s',
                  cursor: 'pointer',
                  padding: 0,
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#f1f5f9')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(241,245,249,0.6)')}
              >
                {item.label}
              </button>
            ))}
            
            {/* Login Button */}
            <button
              onClick={handleLoginClick}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '12px',
                fontWeight: 500,
                color: '#5865F2',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                transition: 'color 0.2s',
                cursor: 'pointer',
                padding: 0,
              }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#7289da')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#5865F2')}
            >
              {t.landing.nav.login}
            </button>

            {onEnter && (
              <button
                onClick={onEnter}
                style={{
                  padding: '7px 18px',
                  background: 'transparent',
                  color: '#FF4655',
                  border: '1px solid #FF4655',
                  fontFamily: "'Inter', 'Noto Sans KR', sans-serif",
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'background 0.2s, color 0.2s',
                  minHeight: 'unset',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = '#FF4655';
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#FF4655';
                }}
              >
                {t.landing.nav.enterAuction}
              </button>
            )}
            <LangSwitcher />
          </div>
        )}

        {/* Mobile: Hamburger + lang switcher */}
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <LangSwitcher />
            <button
              onClick={() => setMenuOpen(o => !o)}
              className={menuOpen ? 'hbg-open' : ''}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px',
                width: '40px',
                height: '40px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '0',
                minHeight: 'unset',
              }}
            >
              <span className="hbg-line hbg-line-top" />
              <span className="hbg-line hbg-line-mid" />
              <span className="hbg-line hbg-line-bot" />
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Drawer */}
      {isMobile && menuOpen && (
        <div
          className="landing-drawer"
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
            background: 'rgba(10,11,15,0.98)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '40px 24px 48px',
            gap: '0',
            overflowY: 'auto',
          }}
        >
          {/* Nav links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
            {navItems.map((item, i) => (
              <button
                key={i}
                onClick={() => handleNavClick(item.href)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,70,85,0.1)',
                  textAlign: 'left',
                  padding: '20px 0',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: 'rgba(241,245,249,0.7)',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', 'Noto Sans KR', sans-serif",
                  cursor: 'pointer',
                  width: '100%',
                  minHeight: 'unset',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'color 0.2s',
                }}
              >
                <span style={{ width: '24px', height: '1px', background: '#FF4655', display: 'block', flexShrink: 0 }} />
                {item.label}
              </button>
            ))}
            <button
                onClick={() => { setMenuOpen(false); handleLoginClick(); }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,70,85,0.1)',
                  textAlign: 'left',
                  padding: '20px 0',
                  fontSize: '18px',
                  fontWeight: 600,
                  color: '#5865F2',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', 'Noto Sans KR', sans-serif",
                  cursor: 'pointer',
                  width: '100%',
                  minHeight: 'unset',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'color 0.2s',
                }}
              >
                <span style={{ width: '24px', height: '1px', background: '#5865F2', display: 'block', flexShrink: 0 }} />
                {t.landing.nav.login}
            </button>
          </div>

          {/* CTA */}
          {onEnter && (
            <button
              onClick={() => { setMenuOpen(false); onEnter(); }}
              style={{
                marginTop: '40px',
                padding: '18px 40px',
                background: '#FF4655',
                color: '#fff',
                border: 'none',
                fontFamily: "'Inter', 'Noto Sans KR', sans-serif",
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                width: '100%',
                minHeight: 'unset',
              }}
            >
              {t.landing.nav.enterAuction}
            </button>
          )}
        </div>
      )}
    </>
  );
}
