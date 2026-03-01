export type Player = {
  id: string;
  name: string;
  country: string;
  ranking?: number;
  avatar?: string;
};

export type MatchStatus = 'upcoming' | 'live' | 'completed';

export type Match = {
  id: string;
  player1Id: string;
  player2Id: string;
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
  id: string;
  name: string;
  location: string;
  type: 'knockout' | 'round-robin' | 'groups';
  startDate: string;
  endDate: string;
  players: Player[];
  matches: Match[];
};
