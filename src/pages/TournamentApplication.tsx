import { useParams } from 'react-router-dom';
import { Calendar, Trophy, Users } from 'lucide-react';
import { ApplicationForm } from '../components/application/ApplicationForm';
import { NavBar } from '../components/common/NavBar';

// Mock Data
const MOCK_TOURNAMENT = {
  id: 'valorant-season-2',
  title: 'VALORANT CHAMPIONS: OFFSEASON',
  subtitle: 'The ultimate battle for supremacy',
  prize: '₩ 5,000,000',
  date: '2026. 07. 15 - 08. 01',
  slots: '32 Teams',
  bgImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80'
};

export function TournamentApplication() {
  const { tournamentId } = useParams();
  
  // In a real app, we would fetch data using tournamentId.
  // For now, we just use MOCK_TOURNAMENT.
  const tournament = MOCK_TOURNAMENT;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white">
      <NavBar />
      
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${tournament.bgImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F0F0F]/80 via-transparent to-[#0F0F0F]" />
        
        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-16">
          <span className="inline-block px-3 py-1 bg-[#FF4655] text-white text-xs font-bold uppercase tracking-widest mb-4">
            Registration Open
          </span>
          <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4" style={{ textShadow: '4px 4px 0px rgba(0,0,0,0.5)' }}>
            {tournament.title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-medium mb-8">
            {tournament.subtitle}
          </p>
          
          {/* Info Cards */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            <div className="flex items-center gap-3 bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#333] px-6 py-3">
              <Trophy className="text-[#FF4655]" size={24} />
              <div className="text-left">
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Prize Pool</span>
                <span className="font-bold text-lg">{tournament.prize}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#333] px-6 py-3">
              <Calendar className="text-[#FF4655]" size={24} />
              <div className="text-left">
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Schedule</span>
                <span className="font-bold text-lg">{tournament.date}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-[#1A1A1A]/80 backdrop-blur-sm border border-[#333] px-6 py-3">
              <Users className="text-[#FF4655]" size={24} />
              <div className="text-left">
                <span className="block text-[10px] text-gray-400 uppercase font-bold">Capacity</span>
                <span className="font-bold text-lg">{tournament.slots}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black uppercase italic mb-4">Player Application</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Fill out the form below to apply for the tournament. Please ensure all your Riot ID and Discord information is correct before submitting.
            </p>
          </div>
          
          <ApplicationForm />
        </div>
      </section>
    </div>
  );
}
