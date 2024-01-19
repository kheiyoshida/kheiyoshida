import p5 from "p5";
import { createBase } from ".";
import { rotate3D } from "./3d";
import { BaseNode3D } from "./types";

jest.mock('p5')

declare global {
  // eslint-disable-next-line no-var
  var p: p5
}

beforeAll(() => {
  global.p = new p5(jest.fn())
})

test(`${rotate3D.name}`, () => {
  const node:BaseNode3D = {...createBase(), angles: {
    theta: 0,
    phi: 0,
  }}
  rotate3D(
    node,
    10,
    10
  )
})