import { LR } from 'src/domain/entities/utils/direction.ts'
import { closeMapEvent, openMapEvent, turnEvent, walkEvent } from './events'
import { game } from './setup'
import { state } from './state.ts'

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
  if (state.current.mapOpen) {
    closeMapEvent()
  } else {
    openMapEvent()
  }
}
