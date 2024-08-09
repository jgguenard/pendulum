import './app.element.css';
import { Scene } from './scene';
import { pendulums } from './data';
import { Controller } from './controller';
import { PendulumState } from '../../../server/src/types';
import { PendulumPosition } from '@pendulum/common';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];
  private scene: Scene | undefined

  connectedCallback() {
    this.innerHTML = `
    <div class="wrapper">
      <div class="container" id="scene"></div>
      <div class="controls">
        <button class="control control-start">Start</button>
        <button class="control control-pause" disabled>Pause</button>
        <button class="control control-stop" disabled>Stop</button>
      </div>
    </div>
      `;
    const scene = new Scene(this.querySelector('#scene') as HTMLElement)
    const controller = new Controller()

    const startButton = this.querySelector('.control-start')!
    const pauseButton = this.querySelector('.control-pause')!
    const stopButton = this.querySelector('.control-stop')!

    const onPositionUpdate = (positions: PendulumPosition[]) => {
      scene.update(positions)
    }

    const onStateChange = (newState: PendulumState) => {
      switch (newState) {
        case 'started':
          startButton.setAttribute('disabled', 'disabled')
          pauseButton.removeAttribute('disabled')
          stopButton.removeAttribute('disabled')
          controller.startPolling(onPositionUpdate)
          break;
        case 'paused':
          startButton.removeAttribute('disabled')
          pauseButton.setAttribute('disabled', 'disabled')
          stopButton.removeAttribute('disabled')
          controller.stopPolling()
          break;
        case 'stopped':
          startButton.removeAttribute('disabled')
          pauseButton.setAttribute('disabled', 'disabled')
          stopButton.setAttribute('disabled', 'disabled')
          controller.stopPolling()
          break;
      }
    }

    startButton.addEventListener('click', () => {
      startButton.setAttribute('disabled', 'disabled')
      if (scene.isEditModeEnabled()) {
        controller.start(scene.export()).then(onStateChange)
      } else {
        controller.start().then(onStateChange)
      }
      scene.setEditModeEnabled(false)
    })

    pauseButton.addEventListener('click', () => {
      pauseButton.setAttribute('disabled', 'disabled')
      controller.changeStateRequest('pause').then(onStateChange)
    })

    stopButton.addEventListener('click', () => {
      stopButton.setAttribute('disabled', 'disabled')
      controller.changeStateRequest('stop').then(onStateChange)
    })

    pendulums.forEach(pendulum => {
      scene.addPendulum(pendulum)
    })

    this.scene = scene
  }

  disconnectedCallback() {
    this.scene?.dispose()
  }
}
customElements.define('pendulum-root', AppElement);
