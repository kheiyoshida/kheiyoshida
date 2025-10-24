import { state } from '../game/state.ts'
import { LR } from 'src/core/grid/direction.ts'
import { game, maze, player } from '../game/setup'
import { MessageQueue, RenderSignal } from './messages.ts'
import { lightnessMoveDirection } from './query/vision/color'

export const initializeEvent = () => {
  MessageQueue.push(RenderSignal.ShowFloor)
}

export const blockControlRequired = () => {
  state.updateBlockControl(true)
}

export const unblockControlRequired = () => {
  state.updateBlockControl(false)
}

export const blockStatusChangeRequired = () => {
  state.updateBlockStatusChange(true)
}

export const unblockStatusChangeRequired = () => {
  state.updateBlockStatusChange(false)
}

export const idleStatusChangeRequired = () => {
  if (state.current.blockStatusChange) return
  player.updateStatus('idle')

  if (player.isDead) {
    MessageQueue.push(RenderSignal.Die)
  }
}

export const recurringConstantStatusEvent = () => {
  if (state.current.blockStatusChange) return
  if (state.current.mapOpen) return
  player.updateStatus('constant')
}

export const resurrectEvent = () => {
  state.updateBlockControl(true)
  game.restart()
  initializeEvent()
  MessageQueue.push(RenderSignal.Resurrect)
}

export const constantEvent = () => {
  if (state.current.mapOpen) return
  if (MessageQueue.isEmpty) {
    MessageQueue.push(RenderSignal.CurrentView)
  }
  MessageQueue.push(RenderSignal.UpdateMusicDest)
}

export const walkEvent = () => {
  if (state.current.mapOpen) {
    closeMapEvent()
  }
  MessageQueue.push(RenderSignal.Go)
  game.movePlayerToFront()

  player.updateStatus('walk')
  MessageQueue.push(RenderSignal.CurrentView)

  if (game.isPlayerOnStair) {
    goDownstairsEvent()
  }
}

export const goDownstairsEvent = () => {
  MessageQueue.push(RenderSignal.GoDownStairs)

  game.goDownStairs()
  player.updateStatus('downstairs')

  if (maze.currentFloor >= 6 && maze.currentFloor % 3 === 0) {
    lightnessMoveDirection.update()
  }

  MessageQueue.push(RenderSignal.UpdateMusicDest)
  MessageQueue.push(RenderSignal.ProceedToNextFloor)
  MessageQueue.push(RenderSignal.CurrentView)
  MessageQueue.push(RenderSignal.ShowFloor)
}

export const turnEvent = (dir: LR) => {
  if (state.current.mapOpen) {
    closeMapEvent()
  }
  MessageQueue.push(dir === 'right' ? RenderSignal.TurnRight : RenderSignal.TurnLeft)
  player.turn(dir)
  player.updateStatus('turn')
  MessageQueue.push(RenderSignal.CurrentView)
}

export const openMapEvent = () => {
  state.openMap()
  MessageQueue.push(RenderSignal.OpenMap)
}

export const closeMapEvent = () => {
  state.closeMap()
  MessageQueue.push(RenderSignal.CloseMap)
  MessageQueue.push(RenderSignal.CurrentView)
}
