import { initializeEvent } from '../domain/events/events'
import { bindControl } from './control'
import { consumeMessageQueue, setupConstantConsumers } from './render/consumer'
import { demo } from './sound/songs/demo'

export const initializeServices = () => {
  initializeEvent()
  consumeMessageQueue()
  setupConstantConsumers()
  bindControl()
  demo()
}
