import { STAND_INTERVAL_MS } from 'src/maze/config/constants'
import { store } from 'src/maze/store'
import * as mapper from '../../domain/maze/mapper'
import * as maze from '../../domain/maze/maze'
import { updateStats } from '../../domain/stats'
import {
  renderCurrentView,
  renderGo,
  renderGoDownstairs,
  renderProceedToNextFloor,
  renderTurn,
} from '../render'
import { renderMap } from '../render/others/map'
import * as RenderQueue from '../render/queue'
import { setIntervalEvent } from '../timer'

export type EventHandler = () => void

export const initialize: EventHandler = () => {
  maze.generateMaze()
  mapper.reset()
  constant()
  idle()
  renderCurrentView()
}

export const constant: EventHandler = () => {
  setIntervalEvent(
    'constant',
    () => {
      updateStats('constant')
    },
    STAND_INTERVAL_MS * 2
  )
}

export const idle: EventHandler = () => {
  setIntervalEvent(
    'stand',
    () => {
      renderCurrentView()
      updateStats('stand')
    },
    STAND_INTERVAL_MS
  )
}

export const goEvent: EventHandler = () => {
  renderGo()
  const res = maze.navigate()
  mapper.track(res!)
  updateStats('walk')
  renderCurrentView()
}

export const turnEvent = (dir: 'r' | 'l') => async () => {
  renderTurn(dir)()
  maze.turn(dir)
  updateStats('turn')
  renderCurrentView()
}

export const goDownStairs: EventHandler = async () => {
  store.update('acceptCommand', false)
  renderGoDownstairs()
  maze.goDownStairs()
  mapper.reset()
  updateStats('downstairs')
  renderProceedToNextFloor()
  renderCurrentView()
  RenderQueue.wait(() => store.update('acceptCommand', true))
}

export const openMap = () => {
  renderMap(
    mapper.query.grid,
    maze.query.current,
    maze.query.direction,
    maze.query.floor
  )
}
