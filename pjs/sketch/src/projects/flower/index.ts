import p5 from 'p5'
import {
  angleTowardsVector,
  createAddedVector,
  fillScreen,
  pushPop,
  randomColor,
  shakeVector,
  vline,
} from 'src/lib/utils/p5utils'
import { SketchConfigStore, applyConfig } from 'src/lib/utils/project'
import { random, randomBetween, randomIntBetween } from 'src/lib/utils/random'
import { makeStore } from 'src/lib/utils/store'
import {
  Chain,
  MakeChainProcess,
  makeChain,
} from '../../lib/render/helpers/chain'

let unit: number
const store = makeStore<SketchConfigStore & {}>()

const SEED_NUM_MIN = 2
const SEED_NUM_MAX = 5

const Sizing = {
  get sideRange() {
    return unit * 3
  },
  get maxGrowAmount() {
    return unit * 3
  },
  get petalLength() {
    return randomBetween(0, unit * 3)
  },
}

let chain: Chain

const setup = () => {
  store.init({
    cw: p.windowWidth,
    ch: p.windowHeight,
    fillColor: p.color(0),
    strokeColor: p.color(200, 50),
    frameRate: 4,
    strokeWeight: 1,
    // webgl: true,
  })
  unit = p.windowHeight / 100
  applyConfig(store.read())
  p.angleMode(p.DEGREES)
  p.noFill()

  chain = makeChain(
    initSeeds().map((s) => grow(s)),
    30,
    () => {
      p.fill(0)
      fillScreen()
      return initSeeds().map((s) => grow(s))
    }
  )
  chain.start()
}

const draw = () => {
  // pushPop(() => {
  //   p.fill(0, 80)
  //   fillScreen()
  // })
  random(0.1) && chain.changeInterval(randomIntBetween(20, 50))
}

const initSeeds = (num = randomIntBetween(SEED_NUM_MIN, SEED_NUM_MAX)) =>
  [...Array(num)].map(() =>
    p.createVector(p.random(p.width / 5, (p.width * 4) / 5), p.height / 2)
  )

const line = (from: p5.Vector, dest: p5.Vector) => {
  vline(from, dest)
}

const makeGrowDest = (root: p5.Vector) =>
  createAddedVector(
    root,
    randomBetween(-Sizing.sideRange, Sizing.sideRange),
    randomBetween(-Sizing.maxGrowAmount, Sizing.maxGrowAmount)
  )

const grow: MakeChainProcess =
  (root: p5.Vector, n = 0) =>
  () => {
    const dest = makeGrowDest(root)

    if (n > 50) return random(0.5) ? bloom(root, dest) : [null]
    if (n > 20 && random(0.2)) return bloom(root, dest)

    line(root, dest)

    const next = [
      ...(random(0.5) ? [grow(dest, n + 1)] : []),
      ...(random(0.75) ? [grow(dest, n + 1)] : []),
    ]
    return next
  }

const BLOOM_NUM_MIN = 3
const BLOOM_NUM_MAX = 11

const makeBloomDirection = (degree: number, length: number) => {
  return p5.Vector.fromAngle(p.radians(degree), length)
}

const bloom = (root: p5.Vector, dest: p5.Vector) => {
  const direction = angleTowardsVector(root, dest)
  const numOfBloom = randomIntBetween(BLOOM_NUM_MIN, BLOOM_NUM_MAX)
  const devided = 180 / numOfBloom
  const half = -180 * (numOfBloom / 2)
  const directions = [...Array(numOfBloom)].map((_, i) =>
    makeBloomDirection(direction + half + i * devided, Sizing.petalLength)
  )
  return directions.map((dir) => petal(root, dir))
}

const renderPetal = (root: p5.Vector, dir: p5.Vector) => {
  line(root, dir)
  p.noFill()
  p.circle(dir.x, dir.y, unit / 2)
}

const petal =
  (root: p5.Vector, dir: p5.Vector, n = 0) =>
  () => {
    if (n > 10) return []
    const dest = p5.Vector.add(root, dir)

    renderPetal(root, dest)

    const vari = randomBetween(-10, 10)

    const heading = angleTowardsVector(root, dest)
    return [
      ...(random(0.3)
        ? [
            petal(
              dest,
              makeBloomDirection(heading + vari, Sizing.petalLength),
              n + 1
            ),
            // petal(
            //   dest,
            //   makeBloomDirection(heading - vari, Sizing.petalLength),
            //   n + 1
            // ),
          ]
        : []),
    ]
  }

export default <Sketch>{
  setup,
  draw,
  windowResized: () => {},
}
