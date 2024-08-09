import { PendulumState } from '../../../server/src/types';
import { PendulumConfig, PendulumPosition } from '@pendulum/common';

function getPort(id: string) {
  return 3000 + parseInt(id)
}

const ID_LIST = ['1', '2', '3', '4', '5'];
const REFRESH_RATE_MS = 250

export class Controller {

  private intervalRef: ReturnType<typeof setInterval> | undefined

  async start(withConfig?: Array<PendulumConfig>) {
    if (withConfig) {
      const promises = ID_LIST
        .map(id => this.httpRequest(`/config`, getPort(id), {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(withConfig.find(c => c.id === id))
        }))
      await Promise.allSettled(promises)
    }

    return this.changeStateRequest('start')
  }

  async changeStateRequest(state: string) {
    const promises = ID_LIST
      .map(id => this.httpRequest(`/state/${state}`, getPort(id), { method: 'POST' }))
    const results= await Promise.allSettled(promises)
    const settledResults = results.filter(c=> c.status === 'fulfilled')
    const result = settledResults[0]?.value as unknown as { newState: string }
    return result.newState as PendulumState
  }

  startPolling(callback: (positions: PendulumPosition[]) => void): void {
    if (this.intervalRef) {
      this.stopPolling()
    }
    this.intervalRef = setInterval(() => {
      const promises = ID_LIST
        .map(id => this.httpRequest(`/position`, getPort(id)))
      Promise.allSettled(promises).then(results => {
        const settledResults = results.filter(c=> c.status === 'fulfilled')
        const result = settledResults.map(r => r.value as unknown as PendulumPosition)
        callback(result)
      })
    }, REFRESH_RATE_MS)
  }

  stopPolling() {
    clearInterval(this.intervalRef)
  }

  private async httpRequest(path: string, port: number, options = {}) {
    const url = `http://localhost:${port}${path}`
    const response = await fetch(url, options ?? {});
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    return response.json()
  }
}
