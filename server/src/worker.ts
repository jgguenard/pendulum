import { WorkerOptions, PendulumState, TypedResponse, TypedRequestBody } from './types';
import { createStateMachine, randomInt } from './util';
import { SimplePendulum } from './pendulum';
import express from 'express';
import { PendulumConfig, PendulumPosition } from '@pendulum/common';
import mqtt from 'mqtt';
import cors from 'cors';

const DEFAULT_TOPIC = 'pendulum-default-topic'
const STOP_COMMAND = 'STOP'
const RESTART_COMMAND = 'RESTART'
const RESTART_AFTER_MS = 5000
const CHANNEL_USERNAME = 'emqx'
const CHANNEL_PWD = 'public'

export function createWorker(options: WorkerOptions) {

  const log = (msg: string) => console.log(`[pendulum #${options.id}] ${msg}`)

  const pendulum = new SimplePendulum()

  const channel = mqtt.connect(options.channelUrl, {
    clientId: options.channelClientId,
    clean: true,
    connectTimeout: 4000,
    username: CHANNEL_USERNAME,
    password: CHANNEL_PWD,
    reconnectPeriod: 1000,
  })
  let restartCount = 0

  channel.on('connect', () => {
    log(`Connected to MQTT broker with clientId: ${options.channelClientId}`)

    channel.subscribe(DEFAULT_TOPIC)
  })

  channel.on('message', function (topic, message) {
    if (topic === DEFAULT_TOPIC) {
      const command = message.toString()
      log(`Received message from channel: ${command}`)

      if (command === STOP_COMMAND) {
        restartCount = 0
        machine.transition(machine.value, 'stop')
        setTimeout(() => channel.publish(DEFAULT_TOPIC, RESTART_COMMAND, { qos: 2 }), RESTART_AFTER_MS)
      } else if (command === RESTART_COMMAND) {
        restartCount++
        if (restartCount === 5) {
          log(`Received all commands required to restart`)
          machine.transition(machine.value, 'start')
          restartCount = 0
        }
      }
    }
  })

  let neighborsTimerRef: ReturnType<typeof setInterval> | undefined;
  const watchNeighbors = (enabled: boolean) => {
    if (!enabled) {
      clearInterval(neighborsTimerRef)
      return
    }
    neighborsTimerRef = setInterval(() => {
      // todo: real collision algorithm
      const collisionChance = 15
      if (randomInt(1, 100) <= collisionChance) {
        log(`Neighbor #${options.neighbors[0]} will collide, sending STOP command`)
        channel.publish(DEFAULT_TOPIC, STOP_COMMAND)
      }
    }, 5000)
  }

  const machine = createStateMachine<PendulumState>({
    initialState: 'stopped',
    states: {
      stopped: {
        onEnter: () => {
          log('Entering stopped state')
          pendulum.reset()
        },
        transitions: {
          start: {
            target: 'started'
          }
        }
      },
      started: {
        onEnter: () => {
          log('Entering started state')
          pendulum.start()
          watchNeighbors(true)
        },
        onExit: () => {
          log('Exiting started state')
          watchNeighbors(false)
          pendulum.stop()
        },
        transitions: {
          pause: {
            target: 'paused'
          },
          stop: {
            target: 'stopped'
          }
        }
      },
      paused: {
        onEnter: () => {
          log('Entering paused state')
        },
        transitions: {
          start: {
            target: 'started'
          },
          stop: {
            target: 'stopped'
          }
        }
      }
    },
  })

  const api = express();

  api.use(cors())
  api.use(express.json());

  api.get('/position', (req, res: TypedResponse<PendulumPosition>) => {
    res.json({
      angle: pendulum.getAngle(),
      id: options.id.toString()
    });
  })

  api.post('/state/:state', (req, res) => {
    const state = machine.transition(machine.value, req.params.state)
    res.send({ newState: state })
  })

  api.post('/config', (req: TypedRequestBody<PendulumConfig>, res) => {
    pendulum.setConfig(req.body)
    res.send()
  })

  api.listen(options.port, options.host, () => {
    log(`REST API listening to http://${options.host}:${options.port}`);
  });
}
