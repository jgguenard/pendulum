import { StateMachineDefinition } from './types';

export function createStateMachine<State extends string>(definition: StateMachineDefinition<State>) {
  const machine = {
    value: definition.initialState,
    transition(currentState: State, event: string) {
      const currentStateDefinition = definition.states[currentState]
      const destinationTransition = currentStateDefinition.transitions[event]
      if (!destinationTransition) {
        return machine.value
      }
      const destinationState = destinationTransition.target
      const destinationStateDefinition = definition.states[destinationState]

      currentStateDefinition.onExit?.()
      destinationStateDefinition.onEnter?.()

      machine.value = destinationState

      return machine.value
    },
  }
  return machine
}

export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
