import Database from 'better-sqlite3';

const db = new Database('carom.db');
console.log(db.prepare('SELECT id FROM matches').all());
