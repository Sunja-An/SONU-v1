import type { Translations } from './types';

export const kr: Translations = {
  landing: {
    nav: {
      system: '시스템',
      features: '기능',
      team: '팀',
      enterAuction: '경매 시작',
      tournaments: '대회 목록',
      login: '로그인',
    },
    hero: {
      eyebrow: 'VALORANT × TEAM BUILDING',
      title1: 'SONU',
      title2: '멸망전',
      sub1: '발로란트 내전을 위한 실시간 포인트 경매 팀빌딩 플랫폼.',
      sub2: '각 팀장이 포인트를 써서 선수를 낙찰받고 최강의 팀을 구성하세요.',
      ctaPrimary: '경매 입장하기',
      ctaSecondary: '시스템 소개 ↓',
      scroll: 'scroll',
    },
    features: {
      sectionLabel: 'FEATURES',
      title: '경매 시스템 기능',
      items: [
        {
          icon: '⚡',
          tag: 'LIVE AUCTION',
          title: '실시간 경매',
          desc: '카운트다운 타이머와 함께 실시간으로 진행되는 긴장감 넘치는 입찰 시스템. 낙찰 순간의 짜릿함을 경험하세요.',
        },
        {
          icon: '💰',
          tag: 'ECONOMY',
          title: '포인트 관리',
          desc: '각 팀장은 제한된 포인트 내에서 전략적으로 선수를 영입해야 합니다. 잔액과 라인업을 실시간으로 확인하세요.',
        },
        {
          icon: '🏆',
          tag: 'ROSTER',
          title: '팀 빌딩',
          desc: '낙찰된 선수들로 구성된 팀 로스터를 실시간으로 확인. 모든 참가자가 팀 구성 현황을 한눈에 파악할 수 있습니다.',
        },
        {
          icon: '📋',
          tag: 'HISTORY',
          title: '입찰 기록',
          desc: '모든 입찰 히스토리가 실시간으로 기록됩니다. 누가 얼마에 낙찰받았는지 투명하게 공개됩니다.',
        },
        {
          icon: '🎯',
          tag: 'TIER',
          title: '선수 티어 시스템',
          desc: '선수들은 실력 기반 티어로 분류됩니다. 티어에 따른 시작가가 다르게 책정되어 밸런스를 맞춥니다.',
        },
        {
          icon: '⚔️',
          tag: 'DESIGN',
          title: 'VALORANT 테마',
          desc: '발로란트의 날카롭고 역동적인 UI 디자인을 반영한 경매 시스템. 게임과 동일한 긴장감을 느껴보세요.',
        },
      ],
    },
    howItWorks: {
      sectionLabel: 'HOW IT WORKS',
      title: '경매 진행 방식',
      steps: [
        {
          num: '01',
          title: '팀장 배정',
          desc: '참가자 중 팀장을 선정하고 각 팀장에게 동일한 포인트를 지급합니다.',
        },
        {
          num: '02',
          title: '선수 풀 구성',
          desc: '경매에 참여할 선수 목록을 업로드하고 티어를 설정합니다.',
        },
        {
          num: '03',
          title: '경매 시작',
          desc: '선수가 차례로 공개되며, 제한 시간 내에 팀장들이 입찰합니다.',
        },
        {
          num: '04',
          title: '낙찰 및 로스터 확정',
          desc: '최고 입찰가를 제시한 팀장이 선수를 획득. 모든 선수 경매 완료 후 팀이 확정됩니다.',
        },
      ],
    },
    stats: {
      title1: '숫자로 보는',
      title2: 'SONU 멸망전',
      items: [
        { value: 32, label: '최대 참가 선수', suffix: '명' },
        { value: 8, label: '팀 구성', suffix: '팀' },
        { value: 60, label: '입찰 제한 시간', suffix: '초' },
        { value: 1000, label: '팀당 보유 포인트', suffix: 'P' },
      ],
    },
    cta: {
      title1: '지금 바로',
      title2: '경매를 시작하세요',
      sub: '팀장을 선정하고 선수 풀을 구성하면 경매가 시작됩니다.\n최강의 팀을 만들어 승리를 차지하세요.',
      button: '경매장 입장 →',
    },
    footer: {
      copy: 'SONU 멸망전 — VALORANT 경매 시스템',
    },
  },

  auction: {
    header: {
      teams: '팀 참가',
      system: '경매 시스템',
      title: 'SONU 멸망전',
    },
    currentTarget: '현재 경매 대상',
    bidding: '입찰하기',
    bidLog: '입찰 기록',
    nextScheduled: '다음 경매 예정',
    moreCount: '명 더',
    roster: '팀 로스터',
    waiting: '경매 대기 중...',
    bid: {
      highestBid: '최고 입찰가',
      remainingPoints: '잔여 포인트',
      myTeamHighest: '내 팀 최고 입찰',
      teamBidding: '팀 입찰 중',
      nextMinBid: '최소 다음 입찰',
      placeBid: '입찰',
      waitingNext: '다음 경매를 기다리는 중...',
      sold: '낙찰 완료',
      soldToMe: '내 팀이 낙찰!',
      noBid: '입찰 없이 종료됨',
      orMore: '이상',
    },
    log: {
      title: '입찰 기록',
      count: '건',
      empty: '아직 입찰 없음',
      top: '최고',
    },
    // TeamRosterBoard
    roster2: {
      title: '팀 로스터',
      empty: '비어있음',
    },
  },
  login: {
    title: '환영합니다',
    subtitle: 'Discord 계정으로 로그인하여 계속 진행하세요.',
    discordBtn: 'Discord로 로그인',
    backToHome: '홈으로 돌아가기',
  },
  tournaments: {
    title: '진행 중인 대회',
    subtitle: '참여 가능하거나 진행 중인 대회를 확인하세요.',
    status: {
      recruiting: '모집 중',
      ongoing: '진행 중',
      completed: '완료됨',
    },
    viewDetails: '대회 보기',
  },
};
