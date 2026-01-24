import { state } from '../game/state.ts'
import { LR } from 'src/core/grid/direction.ts'
import { game } from '../game'
import { MessageQueue, RenderSignal } from './messages.ts'
import { lightnessMoveDirection } from './query/vision/color'

export const initializeEvent = () => {
  MessageQueue.push(RenderSignal.ShowFloor)
  MessageQueue.push(RenderSignal.ProceedToNextFloor)
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
  game.player.updateStatus('idle')

  if (game.player.isDead) {
    MessageQueue.push(RenderSignal.Die)
  }
}

export const recurringConstantStatusEvent = () => {
  if (state.current.blockStatusChange) return
  if (game.mapper.isOpen) return
  game.player.updateStatus('constant')
}

export const resurrectEvent = () => {
  state.updateBlockControl(true)
  game.restart()
  initializeEvent()
  MessageQueue.push(RenderSignal.Resurrect)
}

export const constantEvent = () => {
  if (game.mapper.isOpen) return
  if (MessageQueue.isEmpty) {
    MessageQueue.push(RenderSignal.CurrentView)
  }
  MessageQueue.push(RenderSignal.UpdateMusicDest)
}

export const walkEvent = () => {
  if (game.mapper.isOpen) {
    closeMapEvent()
  }
  MessageQueue.push(RenderSignal.Go)
  game.movePlayerToFront()

  game.player.updateStatus('walk')
  MessageQueue.push(RenderSignal.CurrentView)

  if (game.isPlayerOnStair) {
    goDownstairsEvent()
  }
}

export const goDownstairsEvent = () => {
  MessageQueue.push(RenderSignal.GoDownStairs)

  game.goDownStairs()
  game.player.updateStatus('downstairs')

  if (game.maze.currentLevelNumber >= 6 && game.maze.currentLevelNumber % 3 === 0) {
    lightnessMoveDirection.update()
  }

  MessageQueue.push(RenderSignal.UpdateMusicDest)
  MessageQueue.push(RenderSignal.ProceedToNextFloor)
  MessageQueue.push(RenderSignal.CurrentView)
  MessageQueue.push(RenderSignal.ShowFloor)
}

export const turnEvent = (dir: LR) => {
  if (game.mapper.isOpen) {
    closeMapEvent()
  }
  MessageQueue.push(dir === 'right' ? RenderSignal.TurnRight : RenderSignal.TurnLeft)
  game.player.turn(dir)
  game.player.updateStatus('turn')
  MessageQueue.push(RenderSignal.CurrentView)
}

export const openMapEvent = () => {
  game.mapper.open()
  MessageQueue.push(RenderSignal.OpenMap)
}

export const closeMapEvent = () => {
  game.mapper.close()
  MessageQueue.push(RenderSignal.CloseMap)
  MessageQueue.push(RenderSignal.CurrentView)
}
