import { consumeMessageQueue } from "./consumer"
import * as handlers from '../domain/events/commands'

export const go = () => {
  handlers.go()
  consumeMessageQueue()
}

export const callMap = () => {
  handlers.callMap()
  consumeMessageQueue()
}

export const turnRight = () => {
  handlers.turnRight()
  consumeMessageQueue()
}

export const turnLeft = () => {
  handlers.turnLeft()
  consumeMessageQueue()
}