import './app.element.css';
import { Scene } from './scene';
import { pendulums } from './data';
import { Controller } from './controller';

export class AppElement extends HTMLElement {
  public static observedAttributes = [];
  private scene: Scene | undefined

  connectedCallback() {
    this.innerHTML = `
    <div class="wrapper">
      <div class="container" id="scene"></div>
      <div class="controls">
        <button class="control control-start" disabled>Start</button>
        <button class="control control-pause" disabled>Pause</button>
        <button class="control control-stop" disabled>Stop</button>
      </div>
    </div>
      `;
    const scene = new Scene(this.querySelector('#scene') as HTMLElement)
    const controller = new Controller()

    const startButton = this.querySelector('.control-start')!
    startButton.addEventListener('click', () => {
      controller.start()
    })

    const pauseButton = this.querySelector('.control-pause')!
    pauseButton.addEventListener('click', () => {
      controller.pause()
    })

    const stopButton = this.querySelector('.control-stop')!
    stopButton.addEventListener('click', () => {
      controller.stop()
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
