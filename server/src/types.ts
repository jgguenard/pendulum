import { Send } from 'express-serve-static-core';

export interface TypedRequestBody<T> extends Express.Request {
  body: T
}

export interface TypedResponse<ResBody> extends Express.Response {
  json: Send<ResBody, this>
}

export type WorkerOptions = {
  id: number,
  host: string,
  port: number,
  channelUrl: string,
  channelClientId: string,
  neighbors: number[]
}

export type StateMachineState<State extends string> = {
  onEnter?: () => void
  onExit?: () => void
  transitions: Record<string, { target: State }>
}

export type StateMachineDefinition<State extends string> = {
  initialState: State,
  states: Record<State, StateMachineState<State>>
}

export type PendulumState = 'paused' | 'stopped' | 'started'
