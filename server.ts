import express from "express";
import { createServer as createViteServer } from "vite";
import { MOCK_PLAYERS, MOCK_MATCHES } from "./src/mockData";
import { Player, Match, Tournament } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data store (initialized with mock data)
  let players: Player[] = [...MOCK_PLAYERS];
  let matches: Match[] = [...MOCK_MATCHES];
  let tournaments: Tournament[] = [
    {
      id: '1',
      name: 'Seoul World Cup 2024',
      location: 'Seoul, South Korea',
      type: 'knockout',
      startDate: '2024-05-01',
      endDate: '2024-05-07',
      players: MOCK_PLAYERS,
      matches: MOCK_MATCHES,
      targetPoints: 40,
      inningsLimit: 0,
    }
  ];

  // API Routes
  app.get("/api/players", (req, res) => {
    res.json(players);
  });

  app.post("/api/players", (req, res) => {
    const newPlayer = req.body as Player;
    players.push(newPlayer);
    res.status(201).json(newPlayer);
  });

  app.put("/api/players/:id", (req, res) => {
    const { id } = req.params;
    const updatedPlayer = req.body as Player;
    players = players.map(p => p.id === id ? updatedPlayer : p);
    res.json(updatedPlayer);
  });

  app.get("/api/matches", (req, res) => {
    res.json(matches);
  });

  app.post("/api/matches", (req, res) => {
    const newMatch = req.body as Match;
    matches.push(newMatch);
    res.status(201).json(newMatch);
  });

  app.put("/api/matches/:id", (req, res) => {
    const { id } = req.params;
    const updatedMatch = req.body as Match;
    matches = matches.map(m => m.id === id ? updatedMatch : m);
    res.json(updatedMatch);
  });

  app.get("/api/tournaments", (req, res) => {
    res.json(tournaments);
  });

  app.post("/api/tournaments", (req, res) => {
    const newTournament = req.body as Tournament;
    tournaments.push(newTournament);
    res.status(201).json(newTournament);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
