import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TournamentApplicationContainer } from './TournamentApplicationContainer';
import { savePlayerProfile, addTournamentParticipant } from '../../api/players';

// Set up mocks
const mockNavigate = vi.fn();
let mockParams = { tournamentId: 'valorant-season-2' };
let mockLocation = { pathname: '/kr/apply' };

vi.mock('react-router-dom', () => ({
  useParams: () => mockParams,
  useNavigate: () => mockNavigate,
  useLocation: () => mockLocation,
}));

let mockUser: any = {
  id: '123',
  username: 'testuser',
  avatarUrl: 'http://avatar.url',
  nickname: 'TestNick'
};
let mockIsAuthenticated = true;

vi.mock('../../store/authStore', () => ({
  useAuthStore: () => ({
    user: mockUser,
    isAuthenticated: mockIsAuthenticated,
  }),
}));

vi.mock('../../api/valorant', () => ({
  fetchValorantData: vi.fn().mockResolvedValue({
    agents: [
      { uuid: 'agent-1', displayName: 'Jett', displayIcon: 'jett-icon' },
      { uuid: 'agent-2', displayName: 'Sova', displayIcon: 'sova-icon' },
    ],
    roles: [
      { uuid: 'role-1', displayName: 'Duelist', displayIcon: 'duelist-icon' },
      { uuid: 'role-2', displayName: 'Initiator', displayIcon: 'initiator-icon' },
    ],
  }),
}));

vi.mock('../../api/players', () => ({
  savePlayerProfile: vi.fn().mockResolvedValue({ success: true }),
  addTournamentParticipant: vi.fn().mockResolvedValue({ success: true }),
}));

describe('TournamentApplicationContainer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockUser = {
      id: '123',
      username: 'testuser',
      avatarUrl: 'http://avatar.url',
      nickname: 'TestNick'
    };
    mockIsAuthenticated = true;
    mockParams = { tournamentId: 'valorant-season-2' };
    mockLocation = { pathname: '/kr/apply' };
  });

  it('renders Step 1 for authenticated users with prefilled Discord ID', async () => {
    render(<TournamentApplicationContainer />);
    
    // Check if step 1 details are visible
    expect(screen.getByText('01. PLAYER IDENTITY')).toBeInTheDocument();
    
    // Check if Discord ID input has the prefilled username
    const discordInput = screen.getByPlaceholderText('username_discord') as HTMLInputElement;
    expect(discordInput.value).toBe('testuser');
  });

  it('renders authentication screen when user is not logged in', async () => {
    mockIsAuthenticated = false;
    mockUser = null;
    
    render(<TournamentApplicationContainer />);
    
    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
    expect(screen.getByText('Discord 로그인')).toBeInTheDocument();
    
    // Click login redirects
    const loginBtn = screen.getByText('Discord 로그인');
    fireEvent.click(loginBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/kr/login');
  });

  it('guides user through the 4 steps, opens modal, validates correct/incorrect code, and submits details', async () => {
    render(<TournamentApplicationContainer />);

    // --- STEP 1 ---
    const riotInput = screen.getByPlaceholderText('SOVA#KR1') as HTMLInputElement;
    const discordInput = screen.getByPlaceholderText('username_discord') as HTMLInputElement;
    expect(discordInput.value).toBe('testuser');
    const nextBtn1 = screen.getByText('Next Step');

    // Button should be disabled initially if riotId is empty
    expect(nextBtn1).toBeDisabled();

    // Fill in Riot ID
    fireEvent.change(riotInput, { target: { value: 'USER#1234' } });
    expect(nextBtn1).not.toBeDisabled();

    // Click Next Step to go to Step 2
    fireEvent.click(nextBtn1);

    // Wait for step 2 title
    await waitFor(() => {
      expect(screen.getByText('02. POSITION & AGENTS')).toBeInTheDocument();
    });

    // --- STEP 2 ---
    // Select role (Duelist)
    const duelistBtn = screen.getByText('Duelist');
    fireEvent.click(duelistBtn);

    // Select Agent (Jett)
    const jettBtn = screen.getByText('Jett');
    fireEvent.click(jettBtn);

    const nextBtn2 = screen.getByText('Next Step');
    expect(nextBtn2).not.toBeDisabled();
    fireEvent.click(nextBtn2);

    // Wait for step 3 title
    await waitFor(() => {
      expect(screen.getByText('03. RANK DETAILS')).toBeInTheDocument();
    });

    // --- STEP 3 ---
    const selects = screen.getAllByRole('combobox');
    expect(selects.length).toBe(2);

    // Select rank options (Current: Gold, Peak: Platinum)
    fireEvent.change(selects[0], { target: { value: 'Gold' } });
    fireEvent.change(selects[1], { target: { value: 'Platinum' } });

    const nextBtn3 = screen.getByText('Next Step');
    expect(nextBtn3).not.toBeDisabled();
    fireEvent.click(nextBtn3);

    // Wait for step 4 title
    await waitFor(() => {
      expect(screen.getByText('04. FINAL SUBMISSION')).toBeInTheDocument();
    });

    // --- STEP 4 ---
    const introTextarea = screen.getByPlaceholderText('자신의 장점과 팀 매칭을 위한 전략적 플레이스타일을 적어주세요.');
    fireEvent.change(introTextarea, { target: { value: 'Hi, I am Jett main.' } });

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    const registerBtn = screen.getByText('Verify & Register');
    expect(registerBtn).not.toBeDisabled();
    fireEvent.click(registerBtn);

    // Modal should open
    await waitFor(() => {
      expect(screen.getByText('Verification Required')).toBeInTheDocument();
    });

    const inviteCodeInput = screen.getByPlaceholderText('ENTER INVITATION CODE') as HTMLInputElement;
    const verifyCodeBtn = screen.getByText('Verify Code');

    // Try incorrect code
    fireEvent.change(inviteCodeInput, { target: { value: 'WRONGCODE' } });
    fireEvent.click(verifyCodeBtn);

    // Verify error is shown
    await waitFor(() => {
      expect(screen.getByText('유효하지 않은 초대 코드입니다. 다시 입력해 주세요.')).toBeInTheDocument();
    });

    // Try correct code (FAKEINFO)
    fireEvent.change(inviteCodeInput, { target: { value: 'FAKEINFO' } });
    fireEvent.click(verifyCodeBtn);

    // Verify API calls and redirection
    await waitFor(() => {
      expect(savePlayerProfile).toHaveBeenCalledWith({
        nickname: 'TestNick',
        riot_id: 'USER#1234',
        rank: 'GOLD',
        tier: 1,
        main_agent: 'Jett',
        avatar_url: 'http://avatar.url',
      });
      expect(addTournamentParticipant).toHaveBeenCalledWith('valorant-season-2', {
        user_id: '123',
        role: 'MEMBER',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/kr/contests');
    });
  });
});
