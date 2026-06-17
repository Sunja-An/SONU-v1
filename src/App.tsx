/**
 * App.tsx — 언어 섹션 완전 분리 라우팅
 *
 * Route 트리:
 * /                → /jp (리다이렉트)
 *
 * ── JP 섹션 (/jp/*) ─────────────────────────────
 * /jp              → 일본어 랜딩 페이지
 * /jp/register     → 프로필 등록
 * /jp/auction      → 일본어 경매 시스템
 * /jp/*            → /jp (폴백)
 *
 * 그 외             → /jp (폴백)
 */
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './i18n';
import { LandingPage } from './pages/LandingPage';
import { AuctionRoom } from './pages/AuctionRoom';
import { Login } from './pages/Login';
import { TournamentList } from './pages/TournamentList';
import { TournamentApplication } from './pages/TournamentApplication';
import { ProfileRegistration } from './pages/ProfileRegistration';
import { ProfilePreview } from './pages/ProfilePreview';
/* ── ADMIN Imports ─────────────────────────────── */
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { BannerManagement } from './pages/admin/BannerManagement';
import { TournamentManagement } from './pages/admin/TournamentManagement';
import { UserManagement } from './pages/admin/UserManagement';
import { TournamentUsers } from './pages/admin/TournamentUsers';
import { AuctionManagement } from './pages/admin/AuctionManagement';
import { PanelManagement } from './pages/admin/PanelManagement';


/* ── JP 섹션 ─────────────────────────────────── */
function JpRoutes() {
  return (
    <I18nProvider lang="jp">
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="register" element={<ProfileRegistration />} />
        <Route path="leader-register" element={<ProfileRegistration />} /> {/* 추후 분리 예정 */}
        <Route path="profile" element={<ProfilePreview />} />
        <Route path="auction" element={<AuctionRoom />} />
        <Route path="login" element={<Login />} />
        <Route path="tournaments" element={<TournamentList />} />
        <Route path="apply/:tournamentId" element={<TournamentApplication />} />
        <Route path="*" element={<Navigate to="/jp" replace />} />
      </Routes>
    </I18nProvider>
  );
}

/* ── ADMIN 섹션 ──────────────────────────────── */
function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="banners" element={<BannerManagement />} />
        <Route path="tournaments" element={<TournamentManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="tournaments/:tournamentId/users" element={<TournamentUsers />} />
        <Route path="auctions" element={<AuctionManagement />} />
        <Route path="panels" element={<PanelManagement />} />
      </Route>
    </Routes>
  );
}

import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';

/* ── Root ────────────────────────────────────── */
export function App() {
  const initializeAuth = useAuthStore((state) => state.initialize);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 루트 → 일본어 랜딩으로 */}
        <Route path="/" element={<Navigate to="/jp" replace />} />

        {/* JP 섹션 */}
        <Route path="/jp/*" element={<JpRoutes />} />

        {/* ADMIN 섹션 */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* 정의되지 않은 경로 → 일본어 랜딩으로 */}
        <Route path="*" element={<Navigate to="/jp" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
