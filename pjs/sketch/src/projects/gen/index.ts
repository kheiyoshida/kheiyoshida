import p5 from 'p5'
import { pushPop } from 'p5utils/src/render'
import { SketchConfigStore, applyConfig } from 'p5utils/src/utils/project'
import { makeStore, randomFloatBetween as randomBetween } from 'utils'
import { Gene, grow } from './gene'

const store = makeStore<SketchConfigStore>()
const geneStore = makeStore<{ stack: Gene[]; rootAngle: number }>()

const setup = () => {
  store.init({
    cw: p.windowWidth,
    ch: p.windowHeight,
    fillColor: p.color(5, 80),
    strokeColor: p.color(255),
    strokeWeight: 1,
    frameRate: 30,
  })
  geneStore.init({
    stack: [],
    rootAngle: 2,
  })
  applyConfig(store.read())
  p.angleMode(p.DEGREES)
  seed()
}

const randomSeed = (x1: number, y1: number, x2: number, y2: number) => {
  const x = randomBetween(x1, x2)
  const y = randomBetween(y1, y2)
  return p.createVector(x, y)
}

const seed = () => {
  const x = store.read('cw') / 2
  const y = store.read('ch') / 2
  const s = randomSeed(x - 500, y - 100, x + 500, y + 100)
  geneStore.update('stack', (stack) =>
    stack.concat(
      expand<Gene>(
        s,
        2,
        (degree) => ({
          v: s,
          len: 17,
          width: 20,
          age: 30,
          angle: degree,
        }),
        geneStore.read('rootAngle')
      )
    )
  )
}

export function expand<T>(
  root: p5.Vector,
  directions: number,
  cb: (degree: number) => T,
  rootDegree?: number
) {
  if (rootDegree) {
    p.push()
    p.rotate(rootDegree)
  }
  const devided = 360 / directions
  const circle = [...Array(directions)].map((_, x) => x * devided)
  const result: T[] = []
  for (const degree of circle) {
    pushPop(() => {
      p.translate(root.x, root.y)
      p.rotate(degree)
      result.push(cb(degree))
    })
  }
  return result
}

const draw = () => {
  const { cw, ch } = store.read()
  p.noStroke()
  p.rect(0, 0, cw, ch)
  p.stroke(255)

  geneStore.update('rootAngle', (angle) => angle + 1)
  geneStore.update('stack', (stack) =>
    stack.flatMap((gene) => grow(geneStore.read('rootAngle'), gene))
  )

  const geneStack = geneStore.read('stack')

  if (geneStack.length === 0) {
    seed()
  }

  if (geneStack.length > 100) {
    seed()
  }

  if (geneStack.length > 10000) {
    p.noLoop()
  }
}

export default <Sketch>{
  setup,
  draw,
  windowResized: () => {},
}
