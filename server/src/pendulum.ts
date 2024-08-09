import { PendulumConfig } from '@pendulum/common';

export class SimplePendulum {

  private angleRad = 0
  private angle = 0
  private velocity = 0

  private config: PendulumConfig = {
    id: '',
    x: 0,
    y: 0,
    mass: 1,
    stringLength: 1,
    offsetAngle: 0
  }

  private intervalRef: ReturnType<typeof setInterval> | undefined

  constructor() {
    this.reset()
  }

  getAngle() {
    return this.angle
  }

  start() {
    const gravity = this.config.mass * 9.80665
    const rateInMs = 250
    const k = -gravity / this.config.stringLength;
    const rateInSeconds = rateInMs / 1000;

    this.intervalRef = setInterval(() => {
      const acceleration = k * Math.sin(this.angleRad);
      this.velocity += acceleration * rateInSeconds;
      this.setAngleRad(this.angleRad + this.velocity * rateInSeconds)
    }, rateInMs)
  }

  stop() {
    clearInterval(this.intervalRef)
  }

  reset() {
    this.velocity = 0
    this.setAngleRad(Math.PI * this.config.offsetAngle / 180.0)
  }

  setConfig(config: PendulumConfig) {
    this.config = {...config}
    this.reset()
  }

  private setAngleRad(value: number) {
    this.angleRad = value;
    this.angle = Math.round((value * 180.0) / Math.PI)
  }
}
