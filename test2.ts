import { dbService } from './src/db/index';

const inning = {
  matchId: 1,
  inningNumber: 100,
  player1Score: 10,
  player2Score: 10,
  player1Run: 1,
  player2Run: 1
};

try {
  console.log(dbService.addMatchInning(inning));
} catch (e) {
  console.error(e);
}
