export interface ValorantRole {
  uuid: string;
  displayName: string;
  displayIcon: string;
}

export interface ValorantAgent {
  uuid: string;
  displayName: string;
  displayIcon: string;
  role: ValorantRole;
}

interface ApiResponse {
  status: number;
  data: ValorantAgent[];
}

/**
 * Fetches playable agents and extracts roles from valorant-api.com
 * @param lang - 'kr' or 'jp' from the app's routing
 */
export async function fetchValorantData(lang: 'kr' | 'jp') {
  const apiLang = lang === 'kr' ? 'ko-KR' : 'ja-JP';
  const url = `https://valorant-api.com/v1/agents?isPlayableCharacter=true&language=${apiLang}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch Valorant API');
    
    const result: ApiResponse = await response.json();
    const agents = result.data;
    
    // Extract unique roles from agents
    const roleMap = new Map<string, ValorantRole>();
    agents.forEach(agent => {
      if (agent.role && !roleMap.has(agent.role.uuid)) {
        roleMap.set(agent.role.uuid, agent.role);
      }
    });
    
    const roles = Array.from(roleMap.values());
    
    return { agents, roles };
  } catch (error) {
    console.error('Error fetching valorant data:', error);
    return { agents: [], roles: [] };
  }
}
