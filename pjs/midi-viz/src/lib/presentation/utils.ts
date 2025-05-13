import * as T from 'three'

export const toRadians = (degree: number) => degree * (Math.PI / 180)
export const toDegrees = (radians: number) => radians / (Math.PI / 180)

export const getRandomUnitVector = () => new T.Vector3().random().subScalar(0.5).multiplyScalar(2).normalize()
export const getRandomSpeedVector = (speed: number) => getRandomUnitVector().multiplyScalar(speed)

export const xyz =(v: T.Vector3): [number, number, number] => [v.x, v.y, v.z]
