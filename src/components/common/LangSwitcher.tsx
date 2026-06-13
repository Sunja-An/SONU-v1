/**
 * LangSwitcher
 * 헤더에 삽입되는 KR / JP 언어 전환 버튼
 */
import { useTranslation } from '../../i18n';
import type { Lang } from '../../i18n/types';

const LANGS: { code: Lang; label: string; flag: string }[] = [
  { code: 'kr', label: 'KR', flag: '🇰🇷' },
  { code: 'jp', label: 'JP', flag: '🇯🇵' },
];

interface LangSwitcherProps {
  /** 배경이 어두울 때 true (기본값) */
  dark?: boolean;
}

export function LangSwitcher({ dark = true }: LangSwitcherProps) {
  const { lang, switchLang } = useTranslation();

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        border: dark
          ? '1px solid rgba(255,255,255,0.1)'
          : '1px solid rgba(0,0,0,0.12)',
        padding: '2px',
        borderRadius: '0',
      }}
    >
      {LANGS.map(({ code, label, flag }) => {
        const isActive = lang === code;
        return (
          <button
            key={code}
            onClick={() => switchLang(code)}
            title={`Switch to ${label}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              background: isActive ? '#FF4655' : 'transparent',
              color: isActive ? '#fff' : dark ? 'rgba(241,245,249,0.5)' : 'rgba(0,0,0,0.5)',
              border: 'none',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              transition: 'background 0.2s, color 0.2s',
              lineHeight: 1,
            }}
            onMouseEnter={e => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = 'rgba(255,70,85,0.12)';
                (e.currentTarget as HTMLElement).style.color = '#FF4655';
              }
            }}
            onMouseLeave={e => {
              if (!isActive) {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = dark
                  ? 'rgba(241,245,249,0.5)'
                  : 'rgba(0,0,0,0.5)';
              }
            }}
          >
            <span style={{ fontSize: '12px' }}>{flag}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}
