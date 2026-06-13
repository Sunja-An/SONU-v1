<div align="center">
  <img src="public/logo.svg" alt="SONU Logo" width="120" height="120" />
  <h1>SONU 멸망전 : VALORANT AUCTION PLATFORM</h1>
  
  <p><strong>발로란트 테마 온라인 포인트 경매 팀 빌딩 플랫폼</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/GSAP-88CE02?style=for-the-badge&logo=greensock&logoColor=white" alt="GSAP" />
  </p>
</div>

<br />

## 🌟 Introduction (프로젝트 소개)
**SONU 멸망전**은 e스포츠 스트리머 및 유저들이 발로란트 커스텀 토너먼트를 개최할 때, **포인트를 사용하여 선수를 경매로 영입**할 수 있도록 돕는 인터랙티브 웹 플랫폼입니다. VCT(Valorant Champions Tour) 스타일의 프리미엄 다크 테마와 부드러운 애니메이션을 통해 긴장감 넘치는 팀 빌딩 경험을 제공합니다.

## ✨ Core Features (주요 기능)
- **🔥 실시간 포인트 경매 시스템**: 남은 포인트를 계산하며 실시간으로 입찰을 진행하는 옥션 대시보드
- **⚡ 다이내믹 애니메이션**: 낙찰된 선수가 소속 팀 로스터 슬롯으로 날아가는 직관적이고 몰입감 있는 GSAP 기반 UX/UI
- **👥 팀 로스터 보드**: 각 팀의 팀장, 남은 포인트, 역할군별 채워진 슬롯을 한눈에 파악
- **👑 어드민 대시보드 (운영자 전용)**: 배너, 토너먼트, 유저, 경매, 방송용 패널을 관리할 수 있는 강력한 관리자 도구
- **🌐 디스코드 연동(예정)**: 디스코드 로그인 기반 유저 식별 및 권한별 접근 제어 분기

## 🚀 Getting Started (시작하기)

### Prerequisites
- [Bun](https://bun.sh/) (v1.0.0+) or Node.js (v18+)

### Installation
```bash
# 1. 저장소를 클론합니다.
git clone https://github.com/GMS-developer/SONU-v1.git
cd SONU-v1

# 2. 의존성을 설치합니다.
bun install

# 3. 개발 서버를 실행합니다.
bun run dev
```

### Routing Structure
코드 입력 분기에 따른 주요 라우팅 경로는 다음과 같습니다.
- `SONU2026`: 일반 플레이어 정보 페이지 접근
- `LEADER2026`: 팀장 전용 페이지 접근
- `AUCTION2026`: 메인 경매장(Auction Room) 접근
- `/admin`: 운영자(Admin) 전용 대시보드

## 🛠️ Vercel Deployment & GitHub Action
조직(Organization) 레포지토리의 Vercel 무료 배포 제한을 우회하기 위해 **개인 레포지토리 미러링(Mirroring)** GitHub Action이 설정되어 있습니다.

**설정 방법:**
1. 개인 GitHub 계정에 빈 레포지토리(예: `SONU-v1-fork`)를 생성합니다.
2. Personal Access Token (PAT)을 발급받습니다. (권한: `repo`)
3. 이 레포지토리의 **Settings > Secrets and variables > Actions** 에서 새 시크릿을 추가합니다.
   - **Name**: `PERSONAL_REPO_URL`
   - **Value**: `https://<USERNAME>:<PAT>@github.com/<USERNAME>/<REPO_NAME>.git`
4. 이제 `main` 브랜치에 코드가 푸시될 때마다 GitHub Actions가 동작하여 개인 레포지토리로 코드를 복사하며, 해당 개인 레포지토리에 연결된 Vercel 프로젝트가 자동 배포를 진행합니다.

## 🎨 Design Philosophy
최고의 e스포츠 경험을 위해 아래와 같은 디자인 가이드를 준수합니다.
- **Color Palette**: 딥 다크 네이비(`#0a0b0f`), 발로란트 시그니처 레드(`#FF4655`), 티어별 포인트 컬러
- **Typography**: 가독성과 몰입감을 위해 `Inter`, `JetBrains Mono` 및 영문/일문 믹스 폰트 사용
- **Micro-interactions**: 버튼 Hover 시 스와이프 효과, 경매 낙찰 시 Fly & Pop 애니메이션, 블러 효과 적극 활용

---
*Developed for SONU 2026 Tournament.*
