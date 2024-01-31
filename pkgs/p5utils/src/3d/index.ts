import p5 from "p5";

export const toRadians = (degree: number) => degree * (Math.PI / 180)
export const toDegrees = (radians: number) => radians / (Math.PI / 180)

/**
 * https://en.wikipedia.org/wiki/Vector_fields_in_cylindrical_and_spherical_coordinates
 */
export const revertToSphericalCoordinate = (vector: p5.Vector):[theta: number, phi: number] => {
  const theta = Math.acos(-vector.y / vector.mag())
  const phi = Math.atan2(vector.x, vector.z)
  return [
    theta > 0 ? theta : Math.PI + theta, 
    adjustPhi(phi)
    // phi > 0 ? phi : Math.PI + phi
  ]
}

export const adjustPhi = (phi: number) => {
  if (phi > 0) return phi
  return Math.PI * 2 + phi
}