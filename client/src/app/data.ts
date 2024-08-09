import { PendulumDisplayConfig } from './types';

export const MIN_MASS = 30
export const MAX_MASS = 100
export const LINE_THICKNESS = 10

const basePendulum: PendulumDisplayConfig = {
  id: '',
  x: 0,
  stringLength: 1,
  mass: MIN_MASS,
  offsetAngle: 0,
  color: {r: 0, g: 0, b: 0},
  y: LINE_THICKNESS,
  minMass: MIN_MASS,
  maxMass: MAX_MASS,
  lineThickness: LINE_THICKNESS,
}

export const pendulums: PendulumDisplayConfig[] = [
  {
    ...basePendulum,
    id: '1',
    x: 50,
    stringLength: 200,
    mass: MAX_MASS,
    offsetAngle: -35,
    color: {r: 39, g: 101, b: 245}
  },
  {
    ...basePendulum,
    id: '2',
    x: 280,
    stringLength: 100,
    mass: MIN_MASS,
    offsetAngle: 0,
    color: {r: 231, g: 99, b: 0}
  }, {
    ...basePendulum,
    id: '3',
    x: 480,
    stringLength: 300,
    mass: MIN_MASS + 20,
    offsetAngle: 35,
    color: {r: 232, g: 225, b: 0},
  }, {
    ...basePendulum,
    id: '4',
    x: 550,
    stringLength: 80,
    mass: MIN_MASS + 10,
    offsetAngle: -40,
    color: {r: 32, g: 136, b:10}
  }, {
    ...basePendulum,
    id: '5',
    x: 700,
    stringLength: 300,
    mass: MIN_MASS,
    offsetAngle: -5,
    color: {r: 84, g: 84, b: 84}
  }
]
