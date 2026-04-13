import express from 'express';
import cors from 'cors';
import projectsRouter from './routes/projects.js';
import runsRouter from './routes/runs.js';
import browseRouter from './routes/browse.js';
import { ApiRoute, CORS_ORIGIN, DEFAULT_PORT } from './constants.js';

const PORT = parseInt(process.env.PORT || String(DEFAULT_PORT), 10);

const app = express();

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.use(ApiRoute.Projects, projectsRouter);
app.use(ApiRoute.Runs, runsRouter);
app.use(ApiRoute.Browse, browseRouter);

app.get(ApiRoute.Health, (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Dashboard API server running on http://localhost:${PORT}`);
});
