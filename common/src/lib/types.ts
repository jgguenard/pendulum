export type Id = {
  id: string
}

export type Coords = {
  x: number
  y: number
}

export type PendulumConfig = Id & Coords & {
  mass: number
  stringLength: number
  offsetAngle: number
}

export type PendulumPosition = Id & {
  angle: number
}
