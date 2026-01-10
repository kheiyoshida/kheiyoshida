import { getUIRenderer } from './renderer'
import { IsMobile, logicalCenterX, logicalCenterY } from '../../config'
import { randomIntInclusiveBetween } from 'utils'

const interval = 100

const fontSize = IsMobile ? 24 : 12

let currentFloor = ''

const drawFloor = (opacity = 1.0) => {
  const renderer = getUIRenderer()
  renderer.lock('floor')
  renderer.changeFillColor([0, 0, 0.8])
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
  currentFloor = `${floor}`
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
