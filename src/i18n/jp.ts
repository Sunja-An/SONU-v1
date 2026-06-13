import type { Translations } from './types';

export const jp: Translations = {
  landing: {
    nav: {
      system: 'システム',
      features: '機能',
      team: 'チーム',
      enterAuction: 'オークション開始',
      tournaments: '大会一覧',
      login: 'ログイン',
    },
    hero: {
      eyebrow: 'VALORANT × TEAM BUILDING',
      title1: 'SONU',
      title2: '滅亡戦',
      sub1: 'VALORANTの内戦向けリアルタイムポイントオークション チームビルディングプラットフォーム。',
      sub2: '各チームリーダーがポインを使って選手を落札し、最強のチームを結成しましょう。',
      ctaPrimary: 'オークションに入場',
      ctaSecondary: 'システム紹介 ↓',
      scroll: 'scroll',
    },
    features: {
      sectionLabel: 'FEATURES',
      title: 'オークション機能',
      items: [
        {
          icon: '⚡',
          tag: 'LIVE AUCTION',
          title: 'リアルタイムオークション',
          desc: 'カウントダウンタイマーとともにリアルタイムで進行する緊張感あふれる入札システム。落札の瞬間のスリルを体験してください。',
        },
        {
          icon: '💰',
          tag: 'ECONOMY',
          title: 'ポイント管理',
          desc: '各チームリーダーは限られたポイント内で戦略的に選手を獲得する必要があります。残高とラインナップをリアルタイムで確認できます。',
        },
        {
          icon: '🏆',
          tag: 'ROSTER',
          title: 'チームビルディング',
          desc: '落札された選手で構成されたチームロスターをリアルタイムで確認。すべての参加者がチーム編成状況を一目で把握できます。',
        },
        {
          icon: '📋',
          tag: 'HISTORY',
          title: '入札履歴',
          desc: 'すべての入札履歴がリアルタイムで記録されます。誰がいくらで落札したか透明に公開されます。',
        },
        {
          icon: '🎯',
          tag: 'TIER',
          title: '選手ティアシステム',
          desc: '選手は実力ベースのティアで分類されます。ティアによって開始価格が異なるため、バランスが保たれます。',
        },
        {
          icon: '⚔️',
          tag: 'DESIGN',
          title: 'VALORANTテーマ',
          desc: 'VALORANTのシャープでダイナミックなUIデザインを反映したオークションシステム。ゲームと同じ緊張感をお楽しみください。',
        },
      ],
    },
    howItWorks: {
      sectionLabel: 'HOW IT WORKS',
      title: 'オークションの進め方',
      steps: [
        {
          num: '01',
          title: 'チームリーダー選定',
          desc: '参加者の中からチームリーダーを選び、各リーダーに同じポイントを付与します。',
        },
        {
          num: '02',
          title: '選手プール構成',
          desc: 'オークションに参加する選手リストをアップロードし、ティアを設定します。',
        },
        {
          num: '03',
          title: 'オークション開始',
          desc: '選手が順番に公開され、制限時間内にチームリーダーが入札します。',
        },
        {
          num: '04',
          title: '落札・ロスター確定',
          desc: '最高入札額を提示したリーダーが選手を獲得。全選手のオークション終了後、チームが確定されます。',
        },
      ],
    },
    stats: {
      title1: '数字で見る',
      title2: 'SONU 滅亡戦',
      items: [
        { value: 32, label: '最大参加選手', suffix: '名' },
        { value: 8, label: 'チーム数', suffix: 'チーム' },
        { value: 60, label: '入札制限時間', suffix: '秒' },
        { value: 1000, label: 'チームあたりポイント', suffix: 'P' },
      ],
    },
    cta: {
      title1: '今すぐ',
      title2: 'オークションを始めよう',
      sub: 'チームリーダーを選定し選手プールを構成するとオークションが始まります。\n最強のチームを作り、勝利を掴みましょう。',
      button: 'オークション会場へ →',
    },
    footer: {
      copy: 'SONU 滅亡戦 — VALORANT オークションシステム',
    },
  },

  auction: {
    header: {
      teams: 'チーム参加',
      system: 'オークションシステム',
      title: 'SONU 滅亡戦',
    },
    currentTarget: '現在のオークション対象',
    bidding: '入札する',
    bidLog: '入札履歴',
    nextScheduled: '次のオークション予定',
    moreCount: '人',
    roster: 'チームロスター',
    waiting: 'オークション待機中...',
    bid: {
      highestBid: '最高入札額',
      remainingPoints: '残りポイント',
      myTeamHighest: '自チームが最高入札',
      teamBidding: 'チームが入札中',
      nextMinBid: '最低次回入札',
      placeBid: '入札',
      waitingNext: '次のオークションを待っています...',
      sold: '落札完了',
      soldToMe: '自チームが落札！',
      noBid: '入札なしで終了',
      orMore: '以上',
    },
    log: {
      title: '入札履歴',
      count: '件',
      empty: 'まだ入札なし',
      top: '最高',
    },
    // TeamRosterBoard
    roster2: {
      title: 'チームロスター',
      empty: '空き',
    },
  },
  login: {
    title: 'ようこそ',
    subtitle: 'Discordアカウントでログインして続行します。',
    discordBtn: 'Discordでログイン',
    backToHome: 'ホームに戻る',
  },
  tournaments: {
    title: '開催中の大会',
    subtitle: '参加可能または進行中の大会を確認できます。',
    status: {
      recruiting: '募集中',
      ongoing: '進行中',
      completed: '完了',
    },
    viewDetails: '大会を見る',
  },
}
