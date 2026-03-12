export type Player = {
  id: number;
  name: string;
  country: string;
  ranking?: number;
  avatar?: string;
};

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export type MatchInning = {
  id?: number;
  matchId: number;
  inningNumber: number;
  player1Score: number;
  player2Score: number;
  player1Run: number;
  player2Run: number;
};

export type Match = {
  id: number;
  tournamentId?: number;
  player1Id: number;
  player2Id: number;
  player1Score: number;
  player2Score: number;
  innings: number;
  status: MatchStatus;
  startTime: string;
  tableNumber: number;
  targetPoints: number;
  highRun1: number;
  highRun2: number;
};

export type Tournament = {
  id: number;
  name: string;
  location: string;
  type: 'knockout' | 'round-robin' | 'groups';
  startDate: string;
  endDate: string;
  players: Player[];
  matches: Match[];
  targetPoints?: number;
  inningsLimit?: number;
};
