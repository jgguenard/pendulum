import {Worker, isMainThread, workerData} from "worker_threads";
import { createApi } from './api';
import { WorkerOptions } from './types';
import { createWorker } from './worker';

const WORKERS = 0

// if (isMainThread) {
//   createApi()
//
//   for (let i = 1; i <= WORKERS; i++) {
//     new Worker(__filename, {
//       workerData: {
//         id: i,
//         port: 3000 + i,
//         neighbors: (i === 1 ? [2] : (i === WORKERS) ? [4] : [i-1, i+1])
//       },
//     });
//   }
//
// } else {
//   createWorker(workerData as WorkerOptions)
// }

createWorker({
  id: 1,
  port: 3001,
  neighbors: []
})
