import express from "express";
import { createServer as createViteServer } from "vite";
import { dbService } from "./src/db/index";
import { Player, Match, Tournament } from "./src/types";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/players", (req, res) => {
    res.json(dbService.getPlayers());
  });

  app.post("/api/players", (req, res) => {
    const newPlayer = req.body as Player;
    dbService.createPlayer(newPlayer);
    res.status(201).json(newPlayer);
  });

  app.put("/api/players/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedPlayer = req.body as Player;
    dbService.updatePlayer(id, updatedPlayer);
    res.json(updatedPlayer);
  });

  app.get("/api/matches", (req, res) => {
    res.json(dbService.getMatches());
  });

  app.post("/api/matches", (req, res) => {
    const newMatch = req.body as Match;
    dbService.createMatch(newMatch);
    res.status(201).json(newMatch);
  });

  app.put("/api/matches/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedMatch = req.body as Match;
    dbService.updateMatch(id, updatedMatch);
    res.json(updatedMatch);
  });

  app.get("/api/tournaments", (req, res) => {
    res.json(dbService.getTournaments());
  });

  app.post("/api/tournaments", (req, res) => {
    const newTournament = req.body as Tournament;
    dbService.createTournament(newTournament);
    res.status(201).json(newTournament);
  });

  app.put("/api/tournaments/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedTournament = req.body as Tournament;
    dbService.updateTournament(id, updatedTournament);
    res.json(updatedTournament);
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
