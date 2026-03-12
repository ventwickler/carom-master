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
    const createdPlayer = dbService.createPlayer(newPlayer);
    res.status(201).json(createdPlayer);
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
    const createdMatch = dbService.createMatch(newMatch);
    res.status(201).json(createdMatch);
  });

  app.put("/api/matches/:id", (req, res) => {
    const id = Number(req.params.id);
    const updatedMatch = req.body as Match;
    dbService.updateMatch(id, updatedMatch);
    res.json(updatedMatch);
  });

  app.get("/api/matches/:id/innings", (req, res) => {
    const id = Number(req.params.id);
    res.json(dbService.getMatchInnings(id));
  });

  app.post("/api/matches/:id/innings", (req, res) => {
    try {
      const newInning = req.body;
      const result = dbService.addMatchInning(newInning);
      res.status(201).json(result);
    } catch (error) {
      console.error("Error adding match inning:", error);
      res.status(500).json({ error: String(error) });
    }
  });

  app.delete("/api/matches/:id/innings/last", (req, res) => {
    const id = Number(req.params.id);
    const deletedInning = dbService.deleteLastInning(id);
    if (deletedInning) {
      res.json(deletedInning);
    } else {
      res.status(404).json({ error: "No innings found" });
    }
  });

  app.get("/api/tournaments", (req, res) => {
    res.json(dbService.getTournaments());
  });

  app.post("/api/tournaments", (req, res) => {
    const newTournament = req.body as Tournament;
    const createdTournament = dbService.createTournament(newTournament);
    res.status(201).json(createdTournament);
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
