import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { fetchValorantData } from '../../api/valorant';
import { savePlayerProfile, addTournamentParticipant } from '../../api/players';
import { 
  TournamentApplicationPresenter, 
  type TournamentDetails, 
  type ApplicationFormData, 
  type RegisteredDetails 
} from './TournamentApplicationPresenter';

// Mock Tournament Data
const MOCK_TOURNAMENTS: Record<string, TournamentDetails> = {
  'valorant-season-2': {
    id: 'valorant-season-2',
    title: 'VALORANT CHAMPIONS: OFFSEASON',
    subtitle: 'The ultimate battle for supremacy',
    prize: '₩ 5,000,000',
    date: '2026. 07. 15 - 08. 01',
    slots: '32 Teams',
    bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
  },
};

const DEFAULT_TOURNAMENT: TournamentDetails = {
  id: 'general-cup',
  title: 'SONU CHAMPIONS TOURNAMENT',
  subtitle: 'Join the premier custom matching event',
  prize: '₩ 1,000,000',
  date: '2026. 06. 30',
  slots: '8 Teams',
  bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80&w=2071',
};

const TIERS = [
  'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant'
];

export const TournamentApplicationContainer: React.FC = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuthStore();
  const lang = location.pathname.startsWith('/jp') ? 'jp' : 'kr';

  // Resolved Tournament details
  const tournament = (tournamentId && MOCK_TOURNAMENTS[tournamentId]) || {
    ...DEFAULT_TOURNAMENT,
    id: tournamentId || 'general-cup',
  };

  // Valorant state
  const [valorantAgents, setValorantAgents] = useState<{ uuid: string; displayName: string; displayIcon: string }[]>([]);
  const [valorantRoles, setValorantRoles] = useState<{ uuid: string; displayName: string; displayIcon: string }[]>([]);
  const [isValorantLoading, setIsValorantLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState<ApplicationFormData>({
    isLeader: false,
    riotId: '',
    discordId: '',
    role: '',
    agents: [],
    currentTier: '',
    peakTier: '',
    introduction: '',
  });

  // Step state
  const [activeStep, setActiveStep] = useState<number>(1);

  // Modal & Verification states
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>('');
  const [inviteCodeError, setInviteCodeError] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Registration Persistence State
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredDetails, setRegisteredDetails] = useState<RegisteredDetails | null>(null);

  // 1. Fetch Valorant Data
  useEffect(() => {
    setIsValorantLoading(true);
    fetchValorantData(lang).then((data) => {
      setValorantAgents(data.agents || []);
      setValorantRoles(data.roles || []);
      setIsValorantLoading(false);
    });
  }, [lang]);

  // 2. Load Discord Username automatically when user becomes available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        discordId: prev.discordId || user.username || '',
      }));
    }
  }, [user]);

  // 3. Load registration details from localStorage if already registered
  useEffect(() => {
    if (user && tournamentId) {
      const storageKey = `sonu_registration_${tournamentId}_${user.id}`;
      const savedReg = localStorage.getItem(storageKey);
      if (savedReg) {
        try {
          const parsed = JSON.parse(savedReg) as RegisteredDetails;
          setIsRegistered(true);
          setRegisteredDetails(parsed);
        } catch (e) {
          console.error('Failed to parse registration info from localStorage', e);
        }
      } else {
        setIsRegistered(false);
        setRegisteredDetails(null);
      }
    } else {
      setIsRegistered(false);
      setRegisteredDetails(null);
    }
  }, [user, tournamentId]);

  // Form Value Change Handler
  const handleFormChange = (field: keyof ApplicationFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Agent selection/deselection toggle (max 3)
  const handleAgentToggle = (agentUuid: string) => {
    setFormData((prev) => {
      const isSelected = prev.agents.includes(agentUuid);
      if (isSelected) {
        return {
          ...prev,
          agents: prev.agents.filter((uuid) => uuid !== agentUuid),
        };
      }
      if (prev.agents.length >= 3) return prev;
      return {
        ...prev,
        agents: [...prev.agents, agentUuid],
      };
    });
  };

  // Discord Login Redirection Handler
  const handleLoginClick = () => {
    navigate(`/${lang}/login`);
  };

  // Handle open verification modal
  const handleOpenModal = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteCodeError(null);
    setIsModalOpen(true);
  };

  // Handle close verification modal
  const handleCloseModal = () => {
    if (isSubmitting) return; // prevent closing during API submission
    setIsModalOpen(false);
    setInviteCode('');
    setInviteCodeError(null);
  };

  // Confirm Verification & Register Submit (Business Logic)
  const handleConfirmSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tournamentId) {
      setInviteCodeError('Invalid Tournament ID');
      return;
    }
    if (!user) {
      setInviteCodeError('You must be logged in to apply for this tournament.');
      return;
    }

    // Code Verification Check
    if (inviteCode.trim() !== 'FAKEINFO') {
      setInviteCodeError('유효하지 않은 초대 코드입니다. 다시 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setInviteCodeError(null);
    setSubmitError(null);

    try {
      const rankUpper = (formData.currentTier || 'GOLD').toUpperCase();
      const firstAgentUuid = formData.agents[0];
      const mainAgentName = valorantAgents.find((a) => a.uuid === firstAgentUuid)?.displayName || 'Jett';

      // 1. Save player profile details to mock/redis API
      await savePlayerProfile({
        nickname: user.nickname || user.username || 'UnknownAgent',
        riot_id: formData.riotId,
        rank: rankUpper,
        tier: 1, // Default tier subdivision
        main_agent: mainAgentName,
        avatar_url: user.avatarUrl || 'https://cdn.discordapp.com/embed/avatars/0.png',
      });

      // 2. Add to tournament participants API
      const participantRole = formData.isLeader ? 'LEADER' : 'MEMBER';
      await addTournamentParticipant(tournamentId, {
        user_id: user.id,
        role: participantRole,
      });

      // 3. Resolve details for the Presentation Section 3 Preview card
      const selectedRole = valorantRoles.find((r) => r.uuid === formData.role);
      const selectedAgentsList = formData.agents
        .map((uuid) => {
          const agent = valorantAgents.find((a) => a.uuid === uuid);
          return {
            displayName: agent?.displayName || '',
            displayIcon: agent?.displayIcon || '',
          };
        })
        .filter((a) => a.displayName);

      const regDetails: RegisteredDetails = {
        isLeader: formData.isLeader,
        riotId: formData.riotId,
        discordId: formData.discordId,
        roleName: selectedRole?.displayName || 'Unknown Role',
        roleIcon: selectedRole?.displayIcon || '',
        agents: selectedAgentsList,
        currentTier: formData.currentTier,
        peakTier: formData.peakTier,
        introduction: formData.introduction,
      };

      // 4. Save to LocalStorage for persistence across reloads
      const storageKey = `sonu_registration_${tournamentId}_${user.id}`;
      localStorage.setItem(storageKey, JSON.stringify(regDetails));

      // 5. Update Component States
      setIsRegistered(true);
      setRegisteredDetails(regDetails);
      setIsModalOpen(false);

      // 6. Redirect to contests page
      navigate(`/${lang}/contests`);
    } catch (err: any) {
      console.error('Failed to submit tournament application:', err);
      setInviteCodeError(
        err.response?.data?.message || 'Failed to submit application. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <TournamentApplicationPresenter
      tournament={tournament}
      user={user}
      isAuthenticated={isAuthenticated}
      valorantAgents={valorantAgents}
      valorantRoles={valorantRoles}
      isValorantLoading={isValorantLoading}
      formData={formData}
      onFormChange={handleFormChange}
      onAgentToggle={handleAgentToggle}
      isSubmitting={isSubmitting}
      submitError={submitError}
      isRegistered={isRegistered}
      registeredDetails={registeredDetails}
      onLoginClick={handleLoginClick}
      tiers={TIERS}
      activeStep={activeStep}
      onStepChange={setActiveStep}
      isModalOpen={isModalOpen}
      onCloseModal={handleCloseModal}
      inviteCode={inviteCode}
      onInviteCodeChange={setInviteCode}
      onOpenModal={handleOpenModal}
      onConfirmSubmit={handleConfirmSubmit}
      inviteCodeError={inviteCodeError}
    />
  );
};
