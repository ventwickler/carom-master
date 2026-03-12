import Database from 'better-sqlite3';

const db = new Database('carom.db');
console.log(db.prepare('SELECT count(*) FROM match_innings').get());
