import * as mapper from '../../domain/maze/mapper'
import { clearTimer } from '../timer'
import { goDownStairs, goEvent, registerConcurrentStandEvent, openMap, turnEvent } from './events'
import * as validaters from './validaters'

export type CommandHandler = () => void

export const go: CommandHandler = () => {
  if (!validaters.isAccepting()) return
  if (validaters.canGo()) {
    goEvent()
    if (validaters.shouldGoDownstairs()) {
      goDownStairs()
    } else {
      registerConcurrentStandEvent()
    }
  }
}

const turn = (dir: 'r' | 'l') => async () => {
  if (!validaters.isAccepting()) return
  turnEvent(dir)()
}

export const turnRight: CommandHandler = turn('r')
export const turnLeft: CommandHandler = turn('l')

export const callMap: CommandHandler = async () => {
  if (!validaters.isAccepting()) return
  if (validaters.canOpenMap()) {
    clearTimer('stand')
    openMap()
  } else {
    registerConcurrentStandEvent()
  }
  mapper.toggleMap()
}
