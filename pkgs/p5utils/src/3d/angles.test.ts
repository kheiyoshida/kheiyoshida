import {
  divVectorAngles,
  getEvenlyMappedSphericalAngles,
  sumVectorAngles,
  toDegrees,
  toRadians,
  vectorFromDegreeAngles,
  vectorToSphericalAngles,
  vectorToSphericalAngles2,
} from './angles'

test.each([
  [60, Math.PI / 3],
  [90, Math.PI / 2],
  [120, (Math.PI * 2) / 3],
  [180, Math.PI],
  [240, (Math.PI * 4) / 3],
  [270, (Math.PI * 3) / 2],
  [300, (Math.PI * 5) / 3],
  [360, Math.PI * 2],
])(`degrees %i <-> radians %i`, (deg, rad) => {
  expect(toRadians(deg)).toBeCloseTo(rad)
  expect(toDegrees(rad)).toBeCloseTo(deg)
})

describe(`vectorToAngles`, () => {
  test.each([
    [50, 20],
    [90, 30],
    [90, 60],
    [90, 80],
    [90, 90],
    [90, 100],
    [20, 120],
    [4, 120],
    [140, 150],
    [30, 180],
    [30, 200],
    [30, 270],
    [150, 300],
  ])(`${vectorToSphericalAngles2.name} (theta=%i, phi=%i)`, (theta, phi) => {
    const vector = vectorFromDegreeAngles(theta, phi)
    const { theta: rt, phi: rp } = vectorToSphericalAngles2(vector)
    expect(rt).toBeCloseTo(theta)
    expect(rp < 0 ? rp + 360 : rp).toBeCloseTo(phi)
  })

  test.each([
    [50, 20],
    [90, 30],
    [90, 60],
    [90, 80],
    [90, 90],
    [90, 100],
    [20, 120],
    [4, 120],
    [140, 150],
    [30, 180],
    [30, 200],
    [30, 270],
    [150, 300],
  ])(`${vectorToSphericalAngles.name} (theta=%i, phi=%i)`, (theta, phi) => {
    const vector = vectorFromDegreeAngles(theta, phi)
    const [rTheta, rPhi] = vectorToSphericalAngles(vector)
    expect(toDegrees(rTheta)).toBeCloseTo(theta)
    expect(toDegrees(rPhi)).toBeCloseTo(phi)
  })
})

test(`${sumVectorAngles.name}`, () => {
  expect(sumVectorAngles({ theta: 20, phi: 30 }, { theta: 50, phi: 120 })).toMatchObject({
    theta: 70,
    phi: 150,
  })
})

test(`${divVectorAngles.name}`, () => {
  expect(divVectorAngles({ theta: 90, phi: 180 }, 2)).toMatchObject({ theta: 45, phi: 90 })
})

test(`${getEvenlyMappedSphericalAngles.name}`, () => {
  const angles = getEvenlyMappedSphericalAngles(3, [30, 150])
  expect(angles).toHaveLength(3 * 3)
  expect(angles.map((a) => a.theta)).toMatchObject([30, 30, 30, 90, 90, 90, 150, 150, 150])
  expect(angles.map((a) => a.phi)).toMatchObject([0, 120, 240, 0, 120, 240, 0, 120, 240])
})

test(`${vectorFromDegreeAngles.name}`, () => {
  const result = vectorFromDegreeAngles(90, 180, 100)
  const r = result.array()
  expect(r[0]).toBeCloseTo(0)
  expect(r[1]).toBeCloseTo(0)
  expect(r[2]).toBeCloseTo(-100)
})
