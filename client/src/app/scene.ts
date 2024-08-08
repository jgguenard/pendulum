import Konva from 'konva';
import { LINE_THICKNESS, MAX_MASS, MIN_MASS } from './data';
import tinycolor from 'tinycolor2';
import { Pendulum, SelectedPendulum } from './types';

export class Scene {
  protected readonly stage: Konva.Stage
  protected readonly layer: Konva.Layer
  protected selectedPendulum: SelectedPendulum | undefined

  constructor(container: HTMLElement) {
    this.stage = new Konva.Stage({
      container: container.id,
      width: container.offsetWidth,
      height: container.offsetWidth / 2
    });
    this.layer = new Konva.Layer()
    this.init()
  }

  protected init() {
    const topBar = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: LINE_THICKNESS,
      fill: 'blue',
    });

    this.layer.add(topBar)
    this.stage.add(this.layer)

    this.stage.container().style.backgroundColor = '#000'

    this.stage.on('click', (e) => {
      if (e.target !== this.stage) {
        return
      }
      this.toggleSelect()
    })
  }

  addPendulum(pendulum: Pendulum) {
    const group = new Konva.Group({
      id: pendulum.id,
      x: pendulum.x,
      y: pendulum.y,
      rotation: pendulum.angularOffset,
      draggable: true,
    });
    const stringShape =  new Konva.Line({
      points: [0, 0, 0, pendulum.stringLength],
      stroke: tinycolor(pendulum.color).clone().darken(10).toRgbString(),
      strokeWidth: LINE_THICKNESS,
    })
    const ballShape = new Konva.Circle({
      x: 0,
      y: pendulum.stringLength,
      radius: pendulum.mass / 2,
      fill: tinycolor(pendulum.color).toRgbString(),
      draggable: true
    })

    const transformer = new Konva.Transformer({
      nodes: [],
      centeredScaling: true,
      resizeEnabled: true,
      keepRatio: true,
      enabledAnchors: [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ],
      rotateEnabled: false,
      boundBoxFunc: (oldBoundBox, newBoundBox) => {
        const newWidth = Math.abs(newBoundBox.width)
        if (newWidth > MAX_MASS || newWidth < MIN_MASS) {
          return oldBoundBox;
        }
        return newBoundBox
      }
    });

    group.add(stringShape);
    group.add(ballShape);

    this.layer.add(group);
    this.layer.add(transformer)

    group.on('dragmove', () => {
      group.y(pendulum.y)
    })

    ballShape.on('click', () => {
      this.toggleSelect({
        id: pendulum.id,
        group,
        transformer,
        shape: ballShape
      })
    })

    ballShape.on('dragmove', () => {
      const points = [
        0,0,
        ballShape.x(),
        ballShape.y(),
      ]
      stringShape.points(points);
      this.layer.batchDraw();
    })

    // todo: prevent dragging objects outside the canvas
  }

  protected toggleSelect(value?: SelectedPendulum) {
    this.selectedPendulum?.transformer.nodes([])
    if (this.selectedPendulum?.group === value?.group) {
      this.selectedPendulum = undefined
      return
    }
    this.selectedPendulum = value
    if (value) {
      value.transformer.nodes([value.shape])
    }
  }

  update(pendulums: Pendulum[]) {
    console.log(pendulums)
  }

  dispose() {
    // todo: remove event listeners
  }
}
