import * as T from 'three'
import { MeshBasicMaterial, Vector3 } from 'three'
import {
  ChainablePoint,
  constrainPointPosition,
  defaultScene,
  mainCamera,
  MovingChainLine,
  setup,
} from '../../lib/presentation'
import { getRandomSpeedVector, getRandomUnitVector, toRadians, xyz } from '../../lib/presentation/utils.ts'
import { MidiInput } from '../../lib/input'
import { MidiNote } from '../../lib/entities'

export const main = async () => {
  const renderer = setup()
  const scene = defaultScene()
  const camera = mainCamera()
  camera.position.set(0, 0, 500)
  camera.lookAt(0, 0, 0)

  const bgColor = new T.Color(0.1, 0.1, 0.1)
  renderer.setClearColor(bgColor)

  // point setup
  const pointSpeed = 3
  ChainablePoint.decreaseSpeed = (m) => {
    m.setLength(Math.max(0.1, m.length() / 1.02))
  }

  // lines
  ChainablePoint.pullThresholdDistance = 5
  const numOfPointsPerChain = 20
  const numOfChains = 7

  const objColor = new T.Color(0.4, 1, 0.4)
  const chainMat = new MeshBasicMaterial({ color: objColor })
  const makeChainLine = (numOfPoints: number) => {
    const points = [...Array(numOfPoints)].map(
      () => new ChainablePoint(getRandomUnitVector().multiplyScalar(100), getRandomSpeedVector(10))
    )
    return new MovingChainLine(points, chainMat)
  }

  const chains = [...Array(numOfChains)].map(() => makeChainLine(numOfPointsPerChain))

  chains.forEach((chain) => {
    const i = Math.floor(Math.random() * numOfChains)
    const other = chains[i]
    if (other.neighbours.length > 1) return
    chain.connect(chains[i])
  })

  const allMovingPoints = chains.flatMap((chain) => chain.points.map((p) => p))

  let pitchOffset = 0
  setInterval(() => {
    pitchOffset += 1
  }, 10_000)
  const midiCallback = (note: MidiNote, speed: number): void => {
    const pitch = note.pitch + pitchOffset
    const chainNum = (pitch) % numOfChains
    const chain = chains[chainNum]
    const point = chain.points[pitch % chain.points.length]
    point.movement = getRandomSpeedVector(speed)
    point.sortFrag = speed
  }

  // midi
  const midiInput = await MidiInput.create('Logic Pro Virtual Out')
  midiInput.registerEvent('noteon', (note) => {
    if (note.channel === 2) {
      midiCallback(note, pointSpeed)
    }
    if (note.channel === 3) {
      midiCallback(note, pointSpeed * 4)
    }
  })

  ChainablePoint.pullThresholdDistance = 28



  // reference
  // const ballGeo = new SphereGeometry(300)
  // const ballMat = new T.MeshBasicMaterial({ color: new T.Color(1, 0, 0), opacity: 0.5, transparent: true })
  // const ballMesh = new T.Mesh(ballGeo, ballMat)
  // scene.add(ballMesh)

  // Animate bone
  function animate() {
    requestAnimationFrame(animate)

    allMovingPoints.forEach((p) => p.move())
    allMovingPoints.sort((a, b) => b.sortFrag - a.sortFrag)
    allMovingPoints.forEach((p) => p.checkChainReaction())
    chains.forEach((chain) => chain.update())

    constrainPointPosition(200, allMovingPoints)

    const timeComponent = performance.now() * 0.007
    camera.position.set(
      ...xyz(
        new T.Vector3().setFromSphericalCoords(
          800,
          Math.abs(Math.sin(timeComponent * 0.01)),
          toRadians(timeComponent)
        )
      )
    )
    camera.lookAt(new Vector3())

    renderer.render(scene, camera)
  }

  animate()
}
