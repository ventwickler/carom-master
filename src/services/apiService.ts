import { Player, Match, Tournament, MatchInning, User } from '../types';

const API_BASE = '/api';

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const userStr = localStorage.getItem('carom_user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user && user.id) {
        headers['x-user-id'] = user.id.toString();
      }
    } catch (e) {
      console.error('Failed to parse user from localStorage', e);
    }
  }
  return headers;
};

export const apiService = {
  async getPlayers(): Promise<Player[]> {
    const res = await fetch(`${API_BASE}/players`);
    return res.json();
  },

  async createPlayer(player: Player): Promise<Player> {
    const res = await fetch(`${API_BASE}/players`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(player),
    });
    return res.json();
  },

  async updatePlayer(player: Player): Promise<Player> {
    const res = await fetch(`${API_BASE}/players/${player.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(player),
    });
    return res.json();
  },

  async getMatches(): Promise<Match[]> {
    const res = await fetch(`${API_BASE}/matches`);
    return res.json();
  },

  async recordMatch(match: Match): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(match),
    });
    return res.json();
  },

  async updateMatch(match: Match): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches/${match.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(match),
    });
    return res.json();
  },

  async getMatchInnings(matchId: number): Promise<MatchInning[]> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/innings`);
    return res.json();
  },

  async addMatchInning(matchId: number, inning: MatchInning): Promise<MatchInning> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/innings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(inning),
    });
    return res.json();
  },

  async deleteLastInning(matchId: number): Promise<MatchInning | null> {
    const res = await fetch(`${API_BASE}/matches/${matchId}/innings/last`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
  },

  async getTournaments(): Promise<Tournament[]> {
    const res = await fetch(`${API_BASE}/tournaments`);
    return res.json();
  },

  async createTournament(tournament: Tournament): Promise<Tournament> {
    const res = await fetch(`${API_BASE}/tournaments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(tournament),
    });
    return res.json();
  },

  async updateTournament(tournament: Tournament): Promise<Tournament> {
    const res = await fetch(`${API_BASE}/tournaments/${tournament.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(tournament),
    });
    return res.json();
  },
  
  async login(credentials: any): Promise<User> {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },
};
