import Database from 'better-sqlite3';
import { Player, Match, Tournament, MatchInning } from '../types';
import { MOCK_PLAYERS, MOCK_MATCHES, MOCK_TOURNAMENTS } from '../mockData';
import path from 'path';

const db = new Database('carom.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    ranking INTEGER,
    avatar TEXT
  );

  CREATE TABLE IF NOT EXISTS tournaments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    startDate TEXT NOT NULL,
    endDate TEXT NOT NULL,
    targetPoints INTEGER,
    inningsLimit INTEGER
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournamentId INTEGER,
    player1Id INTEGER NOT NULL,
    player2Id INTEGER NOT NULL,
    player1Score INTEGER DEFAULT 0,
    player2Score INTEGER DEFAULT 0,
    innings INTEGER DEFAULT 0,
    status TEXT NOT NULL,
    startTime TEXT NOT NULL,
    tableNumber INTEGER,
    targetPoints INTEGER,
    highRun1 INTEGER DEFAULT 0,
    highRun2 INTEGER DEFAULT 0,
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id),
    FOREIGN KEY (player1Id) REFERENCES players(id),
    FOREIGN KEY (player2Id) REFERENCES players(id)
  );

  CREATE TABLE IF NOT EXISTS tournament_players (
    tournamentId INTEGER,
    playerId INTEGER,
    PRIMARY KEY (tournamentId, playerId),
    FOREIGN KEY (tournamentId) REFERENCES tournaments(id),
    FOREIGN KEY (playerId) REFERENCES players(id)
  );

  CREATE TABLE IF NOT EXISTS match_innings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    matchId INTEGER NOT NULL,
    inningNumber INTEGER NOT NULL,
    player1Score INTEGER NOT NULL,
    player2Score INTEGER NOT NULL,
    player1Run INTEGER NOT NULL,
    player2Run INTEGER NOT NULL,
    FOREIGN KEY (matchId) REFERENCES matches(id)
  );
`);

// Seed data if empty
const playerCount = db.prepare('SELECT count(*) as count FROM players').get() as { count: number };
if (playerCount.count === 0) {
  const insertPlayer = db.prepare('INSERT INTO players (id, name, country, ranking, avatar) VALUES (?, ?, ?, ?, ?)');
  const insertTournament = db.prepare('INSERT INTO tournaments (id, name, location, type, startDate, endDate, targetPoints, inningsLimit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertMatch = db.prepare('INSERT INTO matches (id, tournamentId, player1Id, player2Id, player1Score, player2Score, innings, status, startTime, tableNumber, targetPoints, highRun1, highRun2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertTournamentPlayer = db.prepare('INSERT INTO tournament_players (tournamentId, playerId) VALUES (?, ?)');
  const insertInning = db.prepare('INSERT INTO match_innings (matchId, inningNumber, player1Score, player2Score, player1Run, player2Run) VALUES (?, ?, ?, ?, ?, ?)');

  db.transaction(() => {
    for (const player of MOCK_PLAYERS) {
      insertPlayer.run(player.id, player.name, player.country, player.ranking || null, player.avatar || null);
    }

    for (const tournament of MOCK_TOURNAMENTS) {
      insertTournament.run(
        tournament.id,
        tournament.name,
        tournament.location,
        tournament.type,
        tournament.startDate,
        tournament.endDate,
        tournament.targetPoints || null,
        tournament.inningsLimit || null
      );

      if (tournament.players) {
        for (const player of tournament.players) {
          insertTournamentPlayer.run(tournament.id, player.id);
        }
      }
    }

    for (const match of MOCK_MATCHES) {
      insertMatch.run(
        match.id,
        match.tournamentId || null,
        match.player1Id,
        match.player2Id,
        match.player1Score,
        match.player2Score,
        match.innings,
        match.status,
        match.startTime,
        match.tableNumber,
        match.targetPoints,
        match.highRun1,
        match.highRun2
      );

      // Generate mock innings for completed matches
      if (match.status === 'completed' && match.innings > 0) {
        let p1Score = 0;
        let p2Score = 0;
        for (let i = 1; i <= match.innings; i++) {
          const p1Run = Math.floor(Math.random() * 4);
          const p2Run = Math.floor(Math.random() * 4);
          p1Score += p1Run;
          p2Score += p2Run;
          
          // Ensure final score matches on last inning
          if (i === match.innings) {
            p1Score = match.player1Score;
            p2Score = match.player2Score;
          }

          insertInning.run(
            match.id,
            i,
            p1Score,
            p2Score,
            i === match.innings ? match.player1Score - (p1Score - p1Run) : p1Run,
            i === match.innings ? match.player2Score - (p2Score - p2Run) : p2Run
          );
        }
      }
    }
  })();
}

export const dbService = {
  // Players
  getPlayers: (): Player[] => {
    return db.prepare('SELECT * FROM players').all() as Player[];
  },
  createPlayer: (player: Player) => {
    const info = db.prepare('INSERT INTO players (name, country, ranking, avatar) VALUES (?, ?, ?, ?)')
      .run(player.name, player.country, player.ranking || null, player.avatar || null);
    return { ...player, id: info.lastInsertRowid as number };
  },
  updatePlayer: (id: number, player: Player) => {
    db.prepare('UPDATE players SET name = ?, country = ?, ranking = ?, avatar = ? WHERE id = ?')
      .run(player.name, player.country, player.ranking || null, player.avatar || null, id);
    return player;
  },

  // Matches
  getMatches: (): Match[] => {
    return db.prepare('SELECT * FROM matches').all() as Match[];
  },
  createMatch: (match: Match) => {
    const info = db.prepare('INSERT INTO matches (tournamentId, player1Id, player2Id, player1Score, player2Score, innings, status, startTime, tableNumber, targetPoints, highRun1, highRun2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(match.tournamentId || null, match.player1Id, match.player2Id, match.player1Score, match.player2Score, match.innings, match.status, match.startTime, match.tableNumber, match.targetPoints, match.highRun1, match.highRun2);
    return { ...match, id: info.lastInsertRowid as number };
  },
  updateMatch: (id: number, match: Match) => {
    db.prepare('UPDATE matches SET player1Score = ?, player2Score = ?, innings = ?, status = ?, highRun1 = ?, highRun2 = ? WHERE id = ?')
      .run(match.player1Score, match.player2Score, match.innings, match.status, match.highRun1, match.highRun2, id);
    return match;
  },

  // Innings
  getMatchInnings: (matchId: number): MatchInning[] => {
    return db.prepare('SELECT * FROM match_innings WHERE matchId = ? ORDER BY inningNumber ASC').all(matchId) as MatchInning[];
  },
  addMatchInning: (inning: MatchInning) => {
    const info = db.prepare('INSERT INTO match_innings (matchId, inningNumber, player1Score, player2Score, player1Run, player2Run) VALUES (?, ?, ?, ?, ?, ?)')
      .run(inning.matchId, inning.inningNumber, inning.player1Score, inning.player2Score, inning.player1Run, inning.player2Run);
    return { ...inning, id: info.lastInsertRowid as number };
  },
  deleteLastInning: (matchId: number) => {
    const lastInning = db.prepare('SELECT * FROM match_innings WHERE matchId = ? ORDER BY inningNumber DESC LIMIT 1').get(matchId) as MatchInning;
    if (!lastInning) return null;

    db.prepare('DELETE FROM match_innings WHERE id = ?').run(lastInning.id);
    return lastInning;
  },

  // Tournaments
  getTournaments: (): Tournament[] => {
    const tournaments = db.prepare('SELECT * FROM tournaments').all() as any[];
    return tournaments.map(t => {
      const players = db.prepare(`
        SELECT p.* FROM players p
        JOIN tournament_players tp ON p.id = tp.playerId
        WHERE tp.tournamentId = ?
      `).all(t.id) as Player[];

      const matches = db.prepare('SELECT * FROM matches WHERE tournamentId = ?').all(t.id) as Match[];

      return { ...t, players, matches };
    });
  },
  createTournament: (tournament: Tournament) => {
    const info = db.prepare('INSERT INTO tournaments (name, location, type, startDate, endDate, targetPoints, inningsLimit) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(tournament.name, tournament.location, tournament.type, tournament.startDate, tournament.endDate, tournament.targetPoints || null, tournament.inningsLimit || null);
    
    const tournamentId = info.lastInsertRowid as number;
    const insertTP = db.prepare('INSERT INTO tournament_players (tournamentId, playerId) VALUES (?, ?)');
    const insertTM = db.prepare('UPDATE matches SET tournamentId = ? WHERE id = ?');

    db.transaction(() => {
      if (tournament.players) {
        for (const p of tournament.players) {
          insertTP.run(tournamentId, p.id);
        }
      }
      if (tournament.matches) {
        for (const m of tournament.matches) {
          insertTM.run(tournamentId, m.id);
        }
      }
    })();

    return { ...tournament, id: tournamentId };
  },
  updateTournament: (id: number, tournament: Tournament) => {
    db.prepare('UPDATE tournaments SET name = ?, location = ?, type = ?, startDate = ?, endDate = ?, targetPoints = ?, inningsLimit = ? WHERE id = ?')
      .run(tournament.name, tournament.location, tournament.type, tournament.startDate, tournament.endDate, tournament.targetPoints || null, tournament.inningsLimit || null, id);
    
    // Update players and matches associations
    db.transaction(() => {
      db.prepare('DELETE FROM tournament_players WHERE tournamentId = ?').run(id);
      const insertTP = db.prepare('INSERT INTO tournament_players (tournamentId, playerId) VALUES (?, ?)');
      if (tournament.players) {
        for (const p of tournament.players) {
          insertTP.run(id, p.id);
        }
      }

      // Update matches (assuming they might have changed)
      const updateTM = db.prepare('UPDATE matches SET tournamentId = ? WHERE id = ?');
      if (tournament.matches) {
        for (const m of tournament.matches) {
          updateTM.run(id, m.id);
        }
      }
    })();

    return tournament;
  }
};
