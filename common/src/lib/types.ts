export type Id = {
  id: string
}

export type Coords = {
  x: number
  y: number
}

export type Pendulum = Id & Coords & {
  mass: number
  stringLength: number
  offsetAngle: number
}

export type SaveConfigCommand = {
  config: Pendulum[]
}

export type SimulationState = {
  state: Array<Id & Coords>
}
