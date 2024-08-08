import { WorkerOptions } from './types';
import { Pendulum } from '@pendulum/common';

export function createWorker(options: WorkerOptions) {

  const pendulum: Pendulum = {
    id: '1',
    mass: 10,
    x: 0,
    y: 0,
    offsetAngle: 45,
    stringLength: 100,
  }

  const gravity = pendulum.mass * 9.80665
  const rateInMs = 250

  let velocity = 0;
  let angle = Math.PI * pendulum.offsetAngle / 180;
  let k = -gravity / pendulum.stringLength;
  let rateInSeconds = rateInMs / 1000;

  const interval = setInterval(() => {
    const acceleration = k * Math.sin(angle);
    velocity += acceleration * rateInSeconds;
    angle += velocity * rateInSeconds;
  }, rateInMs)

}
