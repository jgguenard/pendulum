import Konva from 'konva';

export type Pendulum = {
  id: string
  x: number
  y: number
  stringLength: number
  mass: number
  minMass: number,
  maxMass: number,
  angularOffset: number
  lineThickness: number
  color: { r: number, g: number, b: number },
}

export type SelectedPendulum = {
  id: string
  group: Konva.Group,
  transformer: Konva.Transformer
  shape: Konva.Shape
}
