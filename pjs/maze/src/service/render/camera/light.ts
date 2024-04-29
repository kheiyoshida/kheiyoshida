import p5 from 'p5'
import { Position3D } from 'p5utils/src/3d'
import { randomIntInAsymmetricRange, randomIntInclusiveBetween } from 'utils'
import { makeColorManager } from '../color'
import { Colors } from '../color/colors'
import { LightVariables } from '../../../domain/translate/light'

const AmbientLightVal = 20
const MinFallOff = 50
const DefaultFallOff = 250

export const LightColorManager = makeColorManager(Colors.white, () => [
  randomIntInclusiveBetween(200, 250),
  randomIntInclusiveBetween(200, 250),
  randomIntInclusiveBetween(200, 250),
])

export const triggerFadeOut = (frames: number) => {
  LightColorManager.setFixedOperation(['fadeout', frames], frames)
}

export const handleLight = (
  cameraPosition: Position3D,
  directionalPosition: Position3D,
  light: LightVariables
) => {
  LightColorManager.resolve(light.colorParams)
  const falloff = calcLightFalloff(light.visibility)
  p.lightFalloff(0.5, falloff, 0)

  const ambientColor = [AmbientLightVal, AmbientLightVal, AmbientLightVal] as const
  p.directionalLight(...ambientColor, 0, 1, 0)
  p.spotLight(
    ...ambientColor,
    ...cameraPosition,
    ...normalize(...directionalPosition),
    Math.PI * 10,
    50
  )

  const pointLightColor = LightColorManager.currentRGB
  p.pointLight(...pointLightColor, ...cameraPosition)

  p.pointLight(
    ...pointLightColor,
    cameraPosition[0],
    cameraPosition[1],
    cameraPosition[2] - randomIntInAsymmetricRange(50)
  )
}

const calcLightFalloff = (visibility = 1.0) => {
  return 1 / (MinFallOff + DefaultFallOff * visibility)
}

const normalize = (...xyz: Position3D): Position3D => {
  return new p5.Vector(...xyz).normalize().array() as Position3D
}
