/**
 * i18n Context + Hook (v2)
 *
 * - App.tsx에서 lang 값을 prop으로 직접 주입 (useParams 의존 제거)
 * - 언어별 독립 Route 섹션에서 각각 <I18nProvider lang="kr"> / <I18nProvider lang="jp"> 사용
 * - switchLang() 은 현재 경로의 언어 prefix를 교체하여 navigate
 */
import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { kr } from './kr';
import { jp } from './jp';
import type { Lang, Translations } from './types';

export type { Lang };

const TRANSLATIONS: Record<Lang, Translations> = { kr, jp };

interface I18nContextValue {
  lang: Lang;
  t: Translations;
  switchLang: (next: Lang) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  lang: Lang;
  children: ReactNode;
}

export function I18nProvider({ lang, children }: I18nProviderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const switchLang = (next: Lang) => {
    // /kr/auction → /jp/auction  |  /kr → /jp
    const withoutPrefix = location.pathname.replace(/^\/(kr|jp)/, '');
    navigate(`/${next}${withoutPrefix || ''}${location.search}`);
  };

  const value = useMemo<I18nContextValue>(
    () => ({ lang, t: TRANSLATIONS[lang], switchLang }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used inside <I18nProvider>');
  return ctx;
}
