import Database from 'better-sqlite3';
import { Player, Match, Tournament } from '../types';
import { MOCK_PLAYERS, MOCK_MATCHES } from '../mockData';
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
`);

// Seed data if empty
const playerCount = db.prepare('SELECT count(*) as count FROM players').get() as { count: number };
if (playerCount.count === 0) {
  const insertPlayer = db.prepare('INSERT INTO players (id, name, country, ranking, avatar) VALUES (?, ?, ?, ?, ?)');
  const insertTournament = db.prepare('INSERT INTO tournaments (id, name, location, type, startDate, endDate, targetPoints, inningsLimit) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertMatch = db.prepare('INSERT INTO matches (id, tournamentId, player1Id, player2Id, player1Score, player2Score, innings, status, startTime, tableNumber, targetPoints, highRun1, highRun2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  const insertTournamentPlayer = db.prepare('INSERT INTO tournament_players (tournamentId, playerId) VALUES (?, ?)');

  db.transaction(() => {
    for (const player of MOCK_PLAYERS) {
      insertPlayer.run(player.id, player.name, player.country, player.ranking || null, player.avatar || null);
    }

    const tournamentId = 1;
    insertTournament.run(
      tournamentId,
      'Seoul World Cup 2024',
      'Seoul, South Korea',
      'knockout',
      '2024-05-01',
      '2024-05-07',
      40,
      0
    );

    for (const player of MOCK_PLAYERS) {
      insertTournamentPlayer.run(tournamentId, player.id);
    }

    for (const match of MOCK_MATCHES) {
      insertMatch.run(
        match.id,
        tournamentId,
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
    const info = db.prepare('INSERT INTO matches (player1Id, player2Id, player1Score, player2Score, innings, status, startTime, tableNumber, targetPoints, highRun1, highRun2) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .run(match.player1Id, match.player2Id, match.player1Score, match.player2Score, match.innings, match.status, match.startTime, match.tableNumber, match.targetPoints, match.highRun1, match.highRun2);
    return { ...match, id: info.lastInsertRowid as number };
  },
  updateMatch: (id: number, match: Match) => {
    db.prepare('UPDATE matches SET player1Score = ?, player2Score = ?, innings = ?, status = ?, highRun1 = ?, highRun2 = ? WHERE id = ?')
      .run(match.player1Score, match.player2Score, match.innings, match.status, match.highRun1, match.highRun2, id);
    return match;
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
