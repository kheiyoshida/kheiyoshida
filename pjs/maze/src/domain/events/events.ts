import { store } from '../../store'
import * as mapper from '../maze/mapper'
import * as maze from '../maze/maze'
import { updateStats } from '../stats'
import { MessageQueue, RenderSignal } from './messages'

export const initializeEvent = () => {
  maze.generateMaze()
  mapper.resetMap()
  MessageQueue.push(RenderSignal.CurrentView)
}

export const recurringConstantStatusEvent = () => {
  if (store.current.mapOpen) return
  updateStats('constant')
  updateStats('stand')
}

export const standEvent = () => {
  if (store.current.mapOpen) return
  if (MessageQueue.isEmpty) {
    MessageQueue.push(RenderSignal.CurrentView)
  }
}

export const walkEvent = () => {
  if (store.current.mapOpen) {
    closeMapEvent()
  }
  MessageQueue.push(RenderSignal.Go)
  const res = maze.navigate()
  mapper.track(res!)
  updateStats('walk')
  MessageQueue.push(RenderSignal.CurrentView)
}

export const goDownstairsEvent = () => {
  MessageQueue.push(RenderSignal.GoDownStairs)

  maze.goDownStairs()
  mapper.resetMap()
  updateStats('downstairs')

  MessageQueue.push(RenderSignal.ProceedToNextFloor)
  MessageQueue.push(RenderSignal.CurrentView)
}

export const turnEvent = (dir: 'r' | 'l') => {
  if (store.current.mapOpen) {
    closeMapEvent()
  }
  MessageQueue.push(dir === 'r' ? RenderSignal.TurnRight : RenderSignal.TurnLeft)
  maze.turn(dir)
  updateStats('turn')
  MessageQueue.push(RenderSignal.CurrentView)
}

export const openMapEvent = () => {
  store.openMap()
  MessageQueue.push(RenderSignal.OpenMap)
}

export const closeMapEvent = () => {
  store.closeMap()
  MessageQueue.push(RenderSignal.CloseMap)
  MessageQueue.push(RenderSignal.CurrentView)
}
