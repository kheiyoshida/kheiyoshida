import p5 from 'p5'
import { Position3D } from 'p5utils/src/3d'
import { randomIntInAsymmetricRange } from 'utils'

const PointLightVal = 200
const AmbientLightVal = 20
const MinFallOff = 50
const DefaultFallOff = 250

export const light = (
  cameraPosition: Position3D,
  directionalPosition: Position3D,
  visibility?: number
) => {
  if (visibility) {
    const falloff = calcLightFalloff(visibility)
    p.lightFalloff(0.5, falloff, 0)
  }

  const ambientColor = [AmbientLightVal, AmbientLightVal, AmbientLightVal] as const
  p.directionalLight(...ambientColor, 0, 1, 0)
  p.spotLight(
    ...ambientColor,
    ...cameraPosition,
    ...normalize(...directionalPosition),
    Math.PI * 10,
    50
  )

  const pointLightColor = [PointLightVal, PointLightVal, PointLightVal] as const
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
