import { getUIRenderer } from './renderer'
import { IsMobile, logicalCenterY } from '../../config'

const interval = 100

const fontSize = IsMobile ? 24 : 10

let currentFloor = 'B1F'

const drawFloor = (opacity = 1.0) => {
  const renderer = getUIRenderer()
  renderer.lock('floor')
  renderer.changeFillColor([0, 0, 1.0])
  renderer.clearCanvas('floor')
  renderer.drawText({
    positionX: fontSize * 4,
    positionY: logicalCenterY,
    text: currentFloor,
    fontSize,
    alpha: opacity,
    id: 'floor'
  })
}

export const renderFloor = (floor: number) => {
  currentFloor = `B${floor}F`
  fadeIn()
}

const fadeIn = (durationMS = 2000) => {
  let timeElapsed = 0
  const timer = setInterval(() => {
    timeElapsed += interval
    drawFloor(timeElapsed / durationMS)
    if (timeElapsed >= durationMS) {
      clearInterval(timer)
      fadeOut(durationMS)
    }
  }, interval)
}

const fadeOut = (durationMS = 1000) => {
  let timeLeft = Number(durationMS)
  const timer = setInterval(() => {
    timeLeft -= interval
    drawFloor(timeLeft / durationMS)
    if (timeLeft <= 0) {
      hideFloor()
      clearInterval(timer)
    }
  }, interval)
}

const hideFloor = () => {
  const renderer = getUIRenderer()
  renderer.unlock('floor')
  renderer.clearCanvas()
}
