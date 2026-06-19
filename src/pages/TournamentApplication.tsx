import { TournamentApplicationContainer } from '../components/application/TournamentApplicationContainer';

/**
 * TournamentApplication Page
 * Renders the restructured Container component that handles
 * the Tournament Application (Game Matching) business logic.
 */
export function TournamentApplication() {
  return (
    <div className="min-h-screen bg-[#06070b] text-white">
      <TournamentApplicationContainer />
    </div>
  );
}
