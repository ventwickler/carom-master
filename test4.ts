import { dbService } from './src/db/index';

const match = {
  player1Id: 1,
  player2Id: 2,
  player1Score: 0,
  player2Score: 0,
  innings: 0,
  status: 'live',
  startTime: new Date().toISOString(),
  tableNumber: 1,
  targetPoints: 40,
  highRun1: 0,
  highRun2: 0
};

try {
  const newMatch = dbService.createMatch(match as any);
  console.log("Created match:", newMatch);
  const inning = {
    matchId: newMatch.id,
    inningNumber: 1,
    player1Score: 1,
    player2Score: 0,
    player1Run: 1,
    player2Run: 0
  };
  console.log("Adding inning:", dbService.addMatchInning(inning));
} catch (e) {
  console.error(e);
}
