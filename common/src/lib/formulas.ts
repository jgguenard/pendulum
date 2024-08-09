import { Coords } from './types';

export function theta(targetAngle: number, originalAngle: number) {
  return ((targetAngle - originalAngle) + 180) % 360 - 180;
}

export function distanceBetweenPoints(p1: Coords, p2: Coords) {
  return Math.round(Math.sqrt( Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2) ))
}
