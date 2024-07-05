import { statusStore, store } from '../store'
import { LR } from "src/utils/direction"
import * as mapper from './interface/mapper'
import * as maze from './interface/maze'
import { updateStats } from './interface/status'
import { MessageQueue, RenderSignal } from './messages'
import { updateAesthetics } from './interface/aesthetics'

export const initializeEvent = () => {
  maze.generateMaze()
  mapper.resetMap()

  MessageQueue.push(RenderSignal.ShowFloor)
}

export const eventBlockRequired = () => {
  store.updateAcceptCommand(false)
}

export const unblockEvents = () => {
  store.updateAcceptCommand(true)
}

export const recurringConstantStatusEvent = () => {
  if (!store.current.acceptCommand) return
  if (store.current.mapOpen) return
  updateStats('constant')

  MessageQueue.push(RenderSignal.UpdateMusicDest)

  if (statusStore.current.sanity <= 0) {
    MessageQueue.push(RenderSignal.Die)
  }
}

export const resurrectEvent = () => {
  store.updateAcceptCommand(true)
  store.setFloor(1)
  statusStore.resetStatus()
  initializeEvent()
  MessageQueue.push(RenderSignal.Resurrect)
}

export const constantEvent = () => {
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
  updateAesthetics()

  MessageQueue.push(RenderSignal.UpdateMusicDest)
  MessageQueue.push(RenderSignal.ProceedToNextFloor)
  MessageQueue.push(RenderSignal.CurrentView)
  MessageQueue.push(RenderSignal.ShowFloor)
}

export const turnEvent = (dir: LR) => {
  if (store.current.mapOpen) {
    closeMapEvent()
  }
  MessageQueue.push(dir === 'right' ? RenderSignal.TurnRight : RenderSignal.TurnLeft)
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
