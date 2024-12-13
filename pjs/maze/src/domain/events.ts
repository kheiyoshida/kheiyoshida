import { statusStore, store } from '../store'
import { LR } from 'src/utils/direction'
import * as mapper from './mutate/mapper'
import * as maze from './mutate/maze'
import { updateStats } from './mutate/status'
import { MessageQueue, RenderSignal } from './messages'
import { lightnessMoveDirection } from './query/vision/color'
import { initStages } from './mutate/stage.ts'

export const initializeEvent = () => {
  maze.generateMaze()
  mapper.resetMap()
  initStages()

  MessageQueue.push(RenderSignal.ShowFloor)
}

export const blockControlRequired = () => {
  store.updateBlockControl(true)
}

export const unblockControlRequired = () => {
  store.updateBlockControl(false)
}

export const blockStatusChangeRequired = () => {
  store.updateBlockStatusChange(true)
}

export const unblockStatusChangeRequired = () => {
  store.updateBlockStatusChange(false)
}

export const idleStatusChangeRequired = () => {
  if (store.current.blockStatusChange) return
  updateStats('idle')

  if (statusStore.current.sanity <= 0) {
    MessageQueue.push(RenderSignal.Die)
  }
}

export const recurringConstantStatusEvent = () => {
  if (store.current.blockStatusChange) return
  if (store.current.mapOpen) return
  updateStats('constant')
}

export const resurrectEvent = () => {
  store.updateBlockControl(true)
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
  MessageQueue.push(RenderSignal.UpdateMusicDest)
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

  if (store.current.floor >= 6 && store.current.floor % 3 === 0) {
    lightnessMoveDirection.update()
  }

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
