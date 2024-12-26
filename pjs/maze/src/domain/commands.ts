import { LR } from 'src/domain/entities/utils/direction.ts'
import { closeMapEvent, openMapEvent, turnEvent, walkEvent } from './events'
import { mapper } from './entities/map'
import { store } from '../store'
import { game } from './game/setup.ts'

export const isControlBlocked = () => store.current.blockControl

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
  if (mapper.isMapOpen) {
    closeMapEvent()
  } else {
    openMapEvent()
  }
}
