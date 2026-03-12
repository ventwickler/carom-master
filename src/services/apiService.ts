import { Player, Match, Tournament, MatchInning } from '../types';

const API_BASE = '/api';

export const apiService = {
  async getPlayers(): Promise<Player[]> {
    const res = await fetch(`${API_BASE}/players`);
    return res.json();
  },

  async createPlayer(player: Player): Promise<Player> {
    const res = await fetch(`${API_BASE}/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player),
    });
    return res.json();
  },

  async updatePlayer(player: Player): Promise<Player> {
    const res = await fetch(`${API_BASE}/players/${player.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(match),
    });
    return res.json();
  },

  async updateMatch(match: Match): Promise<Match> {
    const res = await fetch(`${API_BASE}/matches/${match.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inning),
    });
    return res.json();
  },

  async getTournaments(): Promise<Tournament[]> {
    const res = await fetch(`${API_BASE}/tournaments`);
    return res.json();
  },

  async createTournament(tournament: Tournament): Promise<Tournament> {
    const res = await fetch(`${API_BASE}/tournaments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tournament),
    });
    return res.json();
  },

  async updateTournament(tournament: Tournament): Promise<Tournament> {
    const res = await fetch(`${API_BASE}/tournaments/${tournament.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tournament),
    });
    return res.json();
  },
};
