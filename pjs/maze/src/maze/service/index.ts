import { initializeEvent } from '../domain/events/events'
import { bindControl } from './control'
import { setupConstantConsumers } from './render/consumer'
import { demo } from './sound/songs/demo'

export const initializeServices = () => {
  initializeEvent()
  setupConstantConsumers()
  bindControl()
  demo()
}
