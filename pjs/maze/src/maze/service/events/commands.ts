import { STAND_INTERVAL_MS } from '../../config/constants'
import * as mapper from '../../domain/maze/mapper'
import * as maze from '../../domain/maze/maze'
import { updateStats } from '../../domain/stats'
import { store } from '../../store'
import {
  renderCurrentView,
  renderGo,
  renderGoDownstairs,
  renderProceedToNextFloor,
  renderTurn,
} from '../render'
import { renderMap } from '../render/others/map'
import { RenderQueue } from '../render/queue'
import { getVisionFromCurrentState } from '../render/vision'
import { clearTimer, setIntervalEvent } from '../timer'
import * as validaters from './validaters'

export type CommandHandler = () => void
export type EventHandler = () => void

export const go: CommandHandler = () => {
  if (!validaters.isAccepting()) return
  if (validaters.canGo()) {
    // render
    const messageQueue: (() => void)[] = []
    renderGo(getVisionFromCurrentState())
    
    // domain
    const res = maze.navigate()
    mapper.track(res!)
    updateStats('walk')
    
    // render
    renderCurrentView(getVisionFromCurrentState())
    

    if (validaters.shouldGoDownstairs()) {
      // domain
      store.updateAcceptCommand(false)

      // render
      
      renderGoDownstairs()

      // domain
      maze.goDownStairs()
      mapper.reset()
      updateStats('downstairs')

      // render
      renderProceedToNextFloor()
      renderCurrentView()

      // domain?
      RenderQueue.waitUntilQueueGetsEmpty(() => store.updateAcceptCommand(true))
    } else {
      // render
      registerRecurringRender()
    }
  }
}

const turn = (dir: 'r' | 'l') => () => {
  if (!validaters.isAccepting()) return
  renderTurn(dir)
  maze.turn(dir)
  updateStats('turn')
  renderCurrentView()
}
export const turnRight: CommandHandler = turn('r')
export const turnLeft: CommandHandler = turn('l')

export const callMap: CommandHandler = () => {
  if (!validaters.isAccepting()) return
  if (validaters.canOpenMap()) {
    clearTimer('stand')
    renderMap(mapper.query.grid, maze.query.current, maze.query.direction, maze.query.floor)
  } else {
    registerRecurringRender()
  }
  mapper.toggleMap()
}

export const initialize: EventHandler = () => {
  maze.generateMaze()
  mapper.reset()
  registerConcurrentConstantEvent()
  registerRecurringRender()
  renderCurrentView()
}

export const registerConcurrentConstantEvent: EventHandler = () => {
  setIntervalEvent(
    'constant',
    () => {
      updateStats('constant')
    },
    STAND_INTERVAL_MS * 2
  )
}

export const registerRecurringRender: EventHandler = () => {
  setIntervalEvent(
    'stand',
    () => {
      renderCurrentView()
      updateStats('stand')
    },
    STAND_INTERVAL_MS
  )
}
