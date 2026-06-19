import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TournamentApplicationPresenter, type TournamentDetails, type ApplicationFormData, type RegisteredDetails } from './TournamentApplicationPresenter';

const MOCK_TOURNAMENT: TournamentDetails = {
  id: 'valorant-season-2',
  title: 'VALORANT CHAMPIONS: OFFSEASON',
  subtitle: 'The ultimate battle for supremacy',
  prize: '₩ 5,000,000',
  date: '2026. 07. 15 - 08. 01',
  slots: '32 Teams',
  bgImage: 'mock-bg-url',
};

const DEFAULT_FORM: ApplicationFormData = {
  isLeader: false,
  riotId: '',
  discordId: '',
  role: '',
  agents: [],
  currentTier: '',
  peakTier: '',
  introduction: '',
};

const MOCK_AGENTS = [
  { uuid: 'agent-1', displayName: 'Jett', displayIcon: 'jett-icon' },
];

const MOCK_ROLES = [
  { uuid: 'role-1', displayName: 'Duelist', displayIcon: 'duelist-icon' },
];

const defaultProps = {
  tournament: MOCK_TOURNAMENT,
  user: null,
  isAuthenticated: true,
  valorantAgents: MOCK_AGENTS,
  valorantRoles: MOCK_ROLES,
  isValorantLoading: false,
  formData: DEFAULT_FORM,
  onFormChange: vi.fn(),
  onAgentToggle: vi.fn(),
  isSubmitting: false,
  submitError: null,
  isRegistered: false,
  registeredDetails: null,
  onLoginClick: vi.fn(),
  tiers: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum'],
  activeStep: 1,
  onStepChange: vi.fn(),
  isModalOpen: false,
  onCloseModal: vi.fn(),
  inviteCode: '',
  onInviteCodeChange: vi.fn(),
  onOpenModal: vi.fn(),
  onConfirmSubmit: vi.fn(),
  inviteCodeError: null,
};

describe('TournamentApplicationPresenter', () => {
  it('renders tournament logistics and details properly', () => {
    render(<TournamentApplicationPresenter {...defaultProps} />);
    
    // Overview Panel
    expect(screen.getByText('VALORANT CHAMPIONS: OFFSEASON')).toBeInTheDocument();
    expect(screen.getByText('The ultimate battle for supremacy')).toBeInTheDocument();
    
    // Logistics panel
    expect(screen.getByText('₩ 5,000,000')).toBeInTheDocument();
    expect(screen.getByText('2026. 07. 15 - 08. 01')).toBeInTheDocument();
    expect(screen.getByText('32 Teams')).toBeInTheDocument();
    
    // Rules Panel
    expect(screen.getByText('MATCH RULES & PROTOCOLS')).toBeInTheDocument();
  });

  it('renders Discord Login panel when unauthenticated', () => {
    const props = {
      ...defaultProps,
      isAuthenticated: false,
    };
    render(<TournamentApplicationPresenter {...props} />);
    
    expect(screen.getByText('Authentication Required')).toBeInTheDocument();
    const loginButton = screen.getByRole('button', { name: /Discord 로그인/ });
    expect(loginButton).toBeInTheDocument();
    
    fireEvent.click(loginButton);
    expect(props.onLoginClick).toHaveBeenCalled();
  });

  it('renders registration complete message when registered', () => {
    const mockRegDetails: RegisteredDetails = {
      isLeader: false,
      riotId: 'SOVA#1234',
      discordId: 'test_discord',
      roleName: 'Duelist',
      roleIcon: 'duelist-icon',
      agents: [{ displayName: 'Jett', displayIcon: 'jett-icon' }],
      currentTier: 'Gold',
      peakTier: 'Platinum',
      introduction: 'Test intro',
    };
    
    const props = {
      ...defaultProps,
      isRegistered: true,
      registeredDetails: mockRegDetails,
    };
    
    render(<TournamentApplicationPresenter {...props} />);
    
    expect(screen.getByText('참가 신청 접수 완료')).toBeInTheDocument();
    expect(screen.queryByText('01. PLAYER IDENTITY')).not.toBeInTheDocument();
  });
});
