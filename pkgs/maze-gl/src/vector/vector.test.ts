import { Vector3D } from './types'
import * as Vec3 from './vector'

test(`${Vec3.sum.name}`, () => {
  const a: Vector3D = [1, 0, 1]
  const b: Vector3D = [0, 1, -1]

  expect(Vec3.sum(a, b)).toEqual([1, 1, 0])
  expect(a).toEqual([1, 0, 1])
  expect(b).toEqual([0, 1, -1])
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

test(`${Vec3.scale.name}`, () => {
  const v = Vec3.create(10)
  Vec3.scale(v, 1 / 10)
  expect(v).toEqual([1, 1, 1])
})

test(`${Vec3.mix.name}`, () => {
  const a: Vector3D = [1, 0, 1]
  const b: Vector3D = [0, 1, -1]

  const mixed = Vec3.mix(a, b, 0.1)
  expect(mixed).toEqual([0.1, 0.9, -0.8])

  expect(a).toEqual([1, 0, 1])
  expect(b).toEqual([0, 1, -1])
})
