import p5 from 'p5'
import { FrequencyData } from 'p5utils/src/media/audio/types'
import { drawLineBetweenVectors } from 'p5utils/src/render'
import { mapToSphere } from 'p5utils/src/render'
import { degree2Vector, pushPop } from 'p5utils/src/render'
import { makePingpongNumberStore, randomIntInclusiveBetween } from 'utils'

export const renderSoundShape = (dataArray: FrequencyData, center: p5.Vector, spin: number) => {
  mapToSphere(
    dataArray,
    (...args) => {
      feather(center, true)(...args)
      feather(center, false)(...args)
    },
    spin
  )
}

const subLen = makePingpongNumberStore(() => randomIntInclusiveBetween(0, 4), 10, 100, 50)

const feather =
  (center: p5.Vector, forward = true): Parameters<typeof mapToSphere>[1] =>
  (theta, phi, data, percent) => {
    if (data < 0.3) return
    const velocity = Math.floor(percent * 100) / 100
    const length = velocity * 400
    const vec1 = degree2Vector(forward ? 0 : 180, phi, length)
    const vec2 = vec1.copy()

    const horiDegree = forward ? 90 : -90
    const rotation = theta + 90 * data
    const hori1 = degree2Vector(horiDegree, phi - rotation, length + p.cos(theta) * 10)
    vec1.add(hori1).add(center)

    subLen.renew()
    sphere(vec1)
    const hori2 = degree2Vector(horiDegree, phi + rotation, p.sin(theta) * subLen.current * percent)
    vec2.add(hori2).add(center)
    sphere(vec2)

    drawLineBetweenVectors(vec1, vec2)
  }

const sphere = (pos: p5.Vector) => {
  pushPop(() => {
    p.translate(pos)
    p.sphere(3)
  })
}
