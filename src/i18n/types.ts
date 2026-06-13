/**
 * i18n 번역 타입 정의
 * 모든 번역 키의 구조를 TypeScript로 강제
 */
export type Lang = 'kr' | 'jp';

export interface Translations {
  // ── Landing Page ──────────────────────────────
  landing: {
    nav: {
      system: string;
      features: string;
      team: string;
      enterAuction: string;
      tournaments: string;
      login: string;
    };
    hero: {
      eyebrow: string;
      title1: string;
      title2: string;
      sub1: string;
      sub2: string;
      ctaPrimary: string;
      ctaSecondary: string;
      scroll: string;
    };
    features: {
      sectionLabel: string;
      title: string;
      items: Array<{ icon: string; tag: string; title: string; desc: string }>;
    };
    howItWorks: {
      sectionLabel: string;
      title: string;
      steps: Array<{ num: string; title: string; desc: string }>;
    };
    stats: {
      title1: string;
      title2: string;
      items: Array<{ label: string; suffix: string; value: number }>;
    };
    cta: {
      title1: string;
      title2: string;
      sub: string;
      button: string;
    };
    footer: {
      copy: string;
    };
  };
  // ── Auction Room ───────────────────────────────
  auction: {
    header: {
      teams: string;
      system: string;
      title: string;
    };
    currentTarget: string;
    bidding: string;
    bidLog: string;
    nextScheduled: string;
    moreCount: string; // e.g. "+2명 더" / "+2人"
    roster: string;
    waiting: string;
    // BidPanel
    bid: {
      highestBid: string;
      remainingPoints: string;
      myTeamHighest: string;
      teamBidding: string;
      nextMinBid: string;
      placeBid: string;
      waitingNext: string;
      sold: string;
      soldToMe: string;
      noBid: string;
      orMore: string; // "이상" / "以上"
    };
    // BidLog
    log: {
      title: string;
      count: string;
      empty: string;
      top: string;
    };
    // TeamRosterBoard
    roster2: {
      title: string;
      empty: string;
    };
  };
  // ── Login Page ────────────────────────────────
  login: {
    title: string;
    subtitle: string;
    discordBtn: string;
    backToHome: string;
  };
  // ── Tournaments Page ──────────────────────────
  tournaments: {
    title: string;
    subtitle: string;
    status: {
      recruiting: string;
      ongoing: string;
      completed: string;
    };
    viewDetails: string;
  };
}
