import { initialize } from "../domain/events/commands"
import { bindControl } from "./control"
import { setupConstantConsumers } from "./render/consumer"
import { demo } from "./sound/songs/demo"

export const initializeServices = () => {
  initialize()
  setupConstantConsumers()
  bindControl()
  demo()
}