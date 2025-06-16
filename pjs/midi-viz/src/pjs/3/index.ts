import * as T from 'three'
import {
  ChainablePoint,
  constrainPointPosition,
  defaultScene,
  mainCamera,
  setup,
} from '../../lib/presentation'
import { getRandomSpeedVector, getRandomUnitVector, toRadians, xyz } from '../../lib/presentation/utils.ts'
import { MidiNote } from '../../lib/entities'
import { MidiInput } from '../../lib/input'
import { TriangleChain } from '../../lib/presentation/objects/triangles.ts'

export const main = async () => {
  const renderer = setup()
  renderer.setClearColor(new T.Color(0.04, 0.05, 0.05))
  const scene = defaultScene()
  const camera = mainCamera()
  camera.position.z = 500

  // texture
  const objColor = new T.Color(0.8, 1.0, 0.8)
  const material = new T.MeshStandardMaterial({
    color: objColor,
    side: T.DoubleSide,
  })

  // point setup
  const pointSpeed = 5
  ChainablePoint.decreaseSpeed = (m) => {
    m.setLength(Math.max(0.1, m.length() / 1.02))
  }
  ChainablePoint.pullThresholdDistance = 100

  // points
  const numOfPointsPerChain = 8
  const numOfChains = 12

  const makeChainLine = (numOfPoints: number) => {
    const points = [...Array(numOfPoints)].map(
      () => new ChainablePoint(getRandomUnitVector().multiplyScalar(100), getRandomSpeedVector(pointSpeed))
    )

    return new TriangleChain(points, material)
  }

  const chains = [...Array(numOfChains)].map(() => makeChainLine(numOfPointsPerChain))

  // connect chains randomly
  chains.forEach((chain) => {
    const i = Math.floor(Math.random() * numOfChains)
    const other = chains[i]
    if (other.neighbours.length > 1) return
    chain.connect(chains[i])
  })

  const allMovingPoints = chains.flatMap((chain) => chain.points.map((p) => p))

  // midi
  let pitchOffset = 0
  setInterval(() => {
    pitchOffset += 1
  }, 10_000)
  const midiCallback = (note: MidiNote, speed: number): void => {
    const pitch = note.pitch + pitchOffset
    const chainNum = pitch % numOfChains
    const chain = chains[chainNum]
    const tail = chain.points[pitch % chain.points.length]
    tail.movement = getRandomSpeedVector(speed)
  }

  const midiInput = await MidiInput.create('Logic Pro Virtual Out')
  midiInput.registerEvent('noteon', (note) => {
    if (note.pitch === 40) {
      midiCallback(note, pointSpeed * 4)
    } else {
      midiCallback(note, pointSpeed)
    }
  })

  // light setup
  const ambient = new T.AmbientLight(0xffffff, 0.1)
  scene.add(ambient)

  const light = new T.DirectionalLight(0xffffff, 1)
  light.position.set(0, 100, 100)
  light.target.position.set(0, 0, 0)
  scene.add(light)
  scene.add(light.target)

  // Render loop
  function animate() {
    requestAnimationFrame(animate)
    allMovingPoints.sort((a, b) => b.movement.length() - a.movement.length())
    allMovingPoints.forEach((p) => p.move())
    allMovingPoints.forEach((p) => p.checkChainReaction())

    constrainPointPosition(400, allMovingPoints)

    chains.forEach((chain) => chain.update())

    const timeComponent = performance.now() * 0.007
    camera.position.set(
      ...xyz(
        new T.Vector3().setFromSphericalCoords(
          400 + 400 * Math.sin(timeComponent * 0.01),
          Math.abs(Math.sin(timeComponent * 0.01)),
          toRadians(timeComponent)
        )
      )
    )
    camera.lookAt(new T.Vector3())

    renderer.render(scene, camera)
  }

  animate()
}
