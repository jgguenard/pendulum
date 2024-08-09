import Konva from 'konva';
import { Id, PendulumConfig } from '@pendulum/common';

export type PendulumDisplayConfig = PendulumConfig & {
  minMass: number,
  maxMass: number,
  lineThickness: number
  color: { r: number, g: number, b: number },
}

export type SelectedPendulum = Id & {
  group: Konva.Group,
  transformer: Konva.Transformer
  shape: Konva.Shape
}
