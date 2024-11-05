import { MobileWidth, ww } from '../config'
import * as commands from '../domain/commands'
import { getButtons } from './interface/buttons'

export const bindControl = () => {
  if (ww < MobileWidth) smallScreen()
  else setupKeyboardControl()
}

const smallScreen = () => {
  const { map, up, right, left } = getButtons()
  map.ontouchstart = commands.callMap
  up.ontouchstart = commands.go
  right.ontouchstart = commands.turnRight
  left.ontouchstart = commands.turnLeft
}

const setupKeyboardControl = () => {
  const keyCodeMap = {
    ArrowUp: commands.go,
    ArrowRight: commands.turnRight,
    ArrowLeft: commands.turnLeft,
    ArrowDown: commands.callMap,
    Enter: commands.callMap,
    m: commands.callMap,
    w: commands.go,
    a: commands.turnLeft,
    s: commands.callMap,
    d: commands.turnRight,
  } as const

  window.addEventListener('keydown', (event) => {
    if (event.key in keyCodeMap) {
      keyCodeMap[event.key as keyof typeof keyCodeMap]()
    }
  })
}
