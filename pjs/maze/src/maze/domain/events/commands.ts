import { RenderQueue } from '../../service/render/queue'
import { clearTimer } from '../../service/timer'
import { store } from '../../store'
import * as mapper from '../maze/mapper'
import * as maze from '../maze/maze'
import { updateStats } from '../stats'
import { MessageQueue, RenderSignal } from './messages'
import * as validaters from './validaters'

export const initialize = () => {
  maze.generateMaze()
  mapper.reset()
}

export const recurringConstantEventHandler = () => {
  updateStats('constant')
}

export const recurringStandEventHandler = () => {
  updateStats('stand')
  MessageQueue.push(RenderSignal.CurrentView)
}

export const go = () => {
  if (!validaters.isAccepting()) return
  if (validaters.canGo()) {
    MessageQueue.push(RenderSignal.Go)
    const res = maze.navigate()
    mapper.track(res!)
    updateStats('walk')
    MessageQueue.push(RenderSignal.CurrentView)

    if (validaters.shouldGoDownstairs()) {
      store.updateAcceptCommand(false)
      MessageQueue.push(RenderSignal.GoDownStairs)

      maze.goDownStairs()
      mapper.reset()
      updateStats('downstairs')

      MessageQueue.push(RenderSignal.ProceedToNextFloor)
      MessageQueue.push(RenderSignal.CurrentView)

      RenderQueue.waitUntilQueueGetsEmpty(() => store.updateAcceptCommand(true))
    }
  }
}

const turn = (dir: 'r' | 'l') => () => {
  if (!validaters.isAccepting()) return
  MessageQueue.push(dir === 'r' ? RenderSignal.TurnRight : RenderSignal.TurnLeft)
  maze.turn(dir)
  updateStats('turn')
  MessageQueue.push(RenderSignal.CurrentView)
}

export const turnRight = turn('r')
export const turnLeft = turn('l')

export const callMap = () => {
  if (!validaters.isAccepting()) return
  if (validaters.canOpenMap()) {
    clearTimer('stand')
    MessageQueue.push(RenderSignal.OpenMap)
  } else {
    MessageQueue.push(RenderSignal.CloseMap)
    //
    // need to restore timer here
    //
  }
}
