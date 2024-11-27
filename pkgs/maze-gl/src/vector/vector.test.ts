import { Vector3D } from './types'
import * as Vec3 from './vector'
import { vec3 } from 'gl-matrix'

test(`${Vec3.sum2.name}`, () => {
  const a: Vector3D = [1, 0, 1]
  const b: Vector3D = [0, 1, -1]

  expect(Vec3.sum2(a, b)).toEqual([1, 1, 0])
  expect(a).toEqual([1, 0, 1])
  expect(b).toEqual([0, 1, -1])
})

test(`${Vec3.sum.name}`, () => {
  const a: Vector3D = [1, 0, 1]
  const b: Vector3D = [0, 1, -1]
  const c: Vector3D = [1, -1, 0]

  expect(Vec3.sum(a, b, c)).toEqual([2, 0, 0])
  expect(a).toEqual([1, 0, 1])
  expect(b).toEqual([0, 1, -1])
  expect(c).toEqual([1, -1, 0])
})

test(`${Vec3.sub.name}`, () => {
  const a: Vector3D = [1, 0, 1]
  const b: Vector3D = [0, 1, -1]

  expect(Vec3.sub(a, b)).toEqual([1, -1, 2])
  expect(a).toEqual([1, 0, 1])
  expect(b).toEqual([0, 1, -1])
})

test(`${Vec3.add.name}`, () => {
  const target: Vector3D = [1, 0, 1]
  const delta: Vector3D = [0, 1, -1]

  Vec3.add(target, delta)
  expect(target).toEqual([1, 1, 0])
  expect(delta).toEqual([0, 1, -1])
})

test(`${Vec3.create.name}`, () => {
  const v = Vec3.create()
  expect(v).toEqual([0, 0, 0])

  const v2 = Vec3.create(10)
  expect(v2).toEqual([10, 10, 10])
})

test(`${Vec3.build.name}`, () => {
  const v = Vec3.build((i) => i * 3)
  expect(v).toEqual([0, 3, 6])
})

test(`${Vec3.scale.name}`, () => {
  const v = Vec3.create(10)
  Vec3.scale(v, 1 / 10)
  expect(v).toEqual([1, 1, 1])
})

test(`${Vec3.scale.name}`, () => {
  const v = Vec3.create(10)
  expect(Vec3.createScaled(v, 1/10)).toEqual([1,1,1])
  expect(v).toEqual([10,10,10])
})

test(`${Vec3.mix.name}`, () => {
  const a: Vector3D = [1, 0, 1]
  const b: Vector3D = [0, 1, -1]

  const mixed = Vec3.mix(a, b, 0.1)
  expect(mixed).toEqual([0.9, 0.1, 0.8])

  expect(a).toEqual([1, 0, 1])
  expect(b).toEqual([0, 1, -1])
})

test(`${Vec3.avg.name}`, () => {
  const a: Vector3D = [1, 0, 1]
  const b: Vector3D = [0, 1, -1]
  const c: Vector3D = [2, -1, 0]

  expect(Vec3.avg(a, b, c)).toEqual([1, 0, 0])
  expect(a).toEqual([1, 0, 1])
  expect(b).toEqual([0, 1, -1])
  expect(c).toEqual([2, -1, 0])
})

test(`${Vec3.random.name}`, () => {
  for (let i = 0; i < 100; i++) {
    const result = Vec3.random(-100, 200)
    result.forEach((v) => {
      expect(v).toBeLessThanOrEqual(200)
      expect(v).toBeGreaterThanOrEqual(-100)
    })
  }
})

test(`${Vec3.mag.name}`, () => {
  const v: Vector3D = [1, 0, 1]
  expect(Vec3.mag(v)).toBeCloseTo(1.41)
  expect(v).toEqual([1, 0, 1])
})

test(`${Vec3.normalize.name}`, () => {
  const v: Vector3D = [4, 0, 4]
  Vec3.normalize(v, 1.41)
  expect(v[0]).toBeCloseTo(1)
  expect(v[1]).toBeCloseTo(0)
  expect(v[2]).toBeCloseTo(1)
})

test(`${Vec3.dot.name}`, () => {
  const a: Vector3D = [1, 0, 1]
  const b: Vector3D = [1, 0, -1]
  expect(Vec3.dot(a, b)).toBeCloseTo(0)


})

test(`${Vec3.cross.name}`, () => {
  const p1: Vector3D = [-1, 0, 0]
  const p2: Vector3D = [0, 1, 0]
  const p3: Vector3D = [1, 0, 0]

  // note that we're in right-handed coordinate system
  // clockwise order - it points away from you
  expect(Vec3.cross(
    Vec3.sub(p2, p1),
    Vec3.sub(p3, p2),
  )).toEqual([0, 0, -2])

  // counterclockwise order - points towards you
  expect(Vec3.cross(
    Vec3.sub(p3, p2),
    Vec3.sub(p2, p1),
  )).toEqual([-0, 0, 2])

  // appendix
  const a: Vector3D = [-1, 0, 0]
  const b: Vector3D = [0, 0, 1]
  const c: Vector3D = [1, 0, 0]

  expect(Vec3.cross(
    Vec3.sub(b, a),
    Vec3.sub(c, b),
  )).toEqual([-0, 2, 0])
})
