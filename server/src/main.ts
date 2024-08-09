import {Worker, isMainThread, workerData} from "worker_threads";
import { WorkerOptions } from './types';
import { createWorker } from './worker';

const WORKERS = 5
const BASE_PORT = 3000
const HOST = 'localhost'
const MQTT_BROKER = 'ws://broker.emqx.io:8083/mqtt'

if (isMainThread) {
  for (let i = 1; i <= WORKERS; i++) {
    const workerOptions: WorkerOptions = {
      id: i,
      host: HOST,
      port: BASE_PORT + i,
      neighbors: (i === 1 ? [2] : (i === WORKERS) ? [4] : [i-1, i+1]),
      channelClientId: `P${Math.random().toString().substring(3, 8)}-${i}`,
      channelUrl: MQTT_BROKER,
    }
    new Worker(__filename, {
      workerData: workerOptions,
    });
  }
} else {
  createWorker(workerData as WorkerOptions)
}
