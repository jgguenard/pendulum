import express from 'express';
import { SaveConfigCommand, SimulationState } from '@pendulum/common';
import { TypedRequestBody, TypedResponse } from './types';

export function createApi() {
  const host = process.env.HOST ?? 'localhost';
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const app = express();

  app.get('/state', (req, res: TypedResponse<SimulationState>) => {
    res.json({ state: [] });
  })

  app.post('/config', (req: TypedRequestBody<SaveConfigCommand>, res) => {
    console.log(req.body);
    res.send()
  })

  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}
