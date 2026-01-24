import { LR } from 'src/core/grid/direction.ts'
import { closeMapEvent, openMapEvent, turnEvent, walkEvent } from './events.ts'
import { game } from '../game'
import { state } from '../game/state.ts'

export const isControlBlocked = () => state.current.blockControl

export const go = () => {
  if (isControlBlocked()) return
  if (game.canPlayerProceed) {
    walkEvent()
  }
}

const turn = (dir: LR) => () => {
  if (isControlBlocked()) return
  turnEvent(dir)
}

export const turnRight = turn('right')
export const turnLeft = turn('left')

export const callMap = () => {
  if (isControlBlocked()) return
  if (game.mapper.isOpen) {
    closeMapEvent()
  } else {
    openMapEvent()
  }
}
