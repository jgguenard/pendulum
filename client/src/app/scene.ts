import Konva from 'konva';
import { LINE_THICKNESS, MAX_MASS, MIN_MASS } from './data';
import tinycolor from 'tinycolor2';
import { PendulumDisplayConfig, SelectedPendulum } from './types';
import { distanceBetweenPoints, PendulumConfig, PendulumPosition, theta } from '@pendulum/common';

export class Scene {

  protected readonly stage: Konva.Stage
  protected readonly layer: Konva.Layer
  protected selectedPendulum?: SelectedPendulum
  protected editModeEnabled: boolean
  protected groups: Record<string, Konva.Group> = {}

  constructor(container: HTMLElement) {
    this.stage = new Konva.Stage({
      container: container.id,
      width: container.offsetWidth,
      height: container.offsetWidth / 2
    });
    this.layer = new Konva.Layer()
    this.editModeEnabled = true
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

  addPendulum(pendulum: PendulumDisplayConfig) {
    const group = new Konva.Group({
      id: pendulum.id,
      x: pendulum.x,
      y: pendulum.y,
      rotation: pendulum.offsetAngle,
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
    this.groups[pendulum.id] = group

    ballShape.on('click', () => {
      if (!this.editModeEnabled) {
        return
      }
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

    ballShape.on('mouseenter', () => {
      this.stage.container().style.cursor = 'pointer';
    });

    ballShape.on('mouseleave', () => {
      this.stage.container().style.cursor = 'default';
    });
  }

  update(pendulums: PendulumPosition[]) {
    pendulums.forEach(pendulum => {
      const currentAngle = this.groups[pendulum.id].rotation()
      this.groups[pendulum.id].rotate(theta(pendulum.angle, currentAngle))
    })
  }

  isEditModeEnabled() {
    return this.editModeEnabled
  }

  setEditModeEnabled(enabled: boolean) {
    if (this.editModeEnabled) {
      this.toggleSelect()
    }
    this.editModeEnabled = enabled
    Object.values(this.groups).forEach(group => {
      group.children[1].setDraggable(enabled)
    })
  }

  export(): PendulumConfig[] {
    return Object.values(this.groups).map(group => {
      const stringShape = (group.children[0] as Konva.Line)
      const ballShape = (group.children[1] as Konva.Circle)
      const a = ballShape.getAbsolutePosition()
      const b = group.getAbsolutePosition()
      const offsetAngle = Math.round((Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI) + 90);
      const groupAngle = group.rotation()
      const p = stringShape.points()
      const stringLength = distanceBetweenPoints({ x: p[0], y: p[1] }, { x: p[2], y: p[3]})

      if (offsetAngle !== groupAngle) {
        group.rotate(theta(offsetAngle, groupAngle))
        stringShape.points([0, 0, 0, stringLength])
        ballShape.setPosition({x: 0, y: stringLength,})
        const points = [
          0,0,
          ballShape.x(),
          ballShape.y(),
        ]
        stringShape.points(points);
        this.layer.batchDraw();
      }

      return {
        id: group.id(),
        offsetAngle: group.rotation(),
        mass: Math.round(ballShape.radius() * ballShape.scaleX() * 2),
        stringLength,
        x: group.x(),
        y: group.y(),
      }
    })
  }

  dispose() {
    // todo: remove event listeners
  }
}
