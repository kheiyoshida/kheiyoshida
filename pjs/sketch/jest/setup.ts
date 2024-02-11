import 'jest-canvas-mock'
import p5 from 'p5'
import { pExtended } from 'p5utils/src/3dShape'

global.p = new p5(jest.fn()) as pExtended