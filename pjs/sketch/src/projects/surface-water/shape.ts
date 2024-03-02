import p5 from 'p5'
import { vectorFromDegreeAngles } from 'p5utils/src/3d'
import { drawAtVectorPosition, drawLineBetweenVectors, mapToSphere } from 'p5utils/src/render'
import { loop } from 'utils'
import { BaseRadius, CanvasSize, DrawGrayValue, MaximumSnapshots } from './config'

type DataSnapshot = p5.Vector[]

const makeSnapshotsManager = () => {
  const snapshots: DataSnapshot[] = []
  return {
    add(snapshot: DataSnapshot) {
      snapshots.unshift(snapshot)
      if (snapshots.length > MaximumSnapshots) {
        snapshots.splice(MaximumSnapshots, 1)
      }
    },
    get current() {
      return snapshots
    },
  }
}

const snapshotManager = makeSnapshotsManager()

export const drawSoundShape = (dataArray: number[]) => {
  const snapshot = create3DSnapshotFromData(dataArray)

  snapshotManager.add(snapshot)
  draw3Dsnapshots(snapshotManager.current)
}

export const create3DSnapshotFromData = (dataArray: number[]): DataSnapshot => {
  const snapshot: DataSnapshot = []
  mapToSphere(
    dataArray,
    (_, phi, data) => {
      const thetaVal = data * 180
      const phiVal = p.frameCount + phi
      const dynamics = Math.abs(data - 0.5)
      if (dynamics > 0.05 && dynamics < 0.4) {
        snapshot.push(vectorFromDegreeAngles(thetaVal, phiVal, 1))
      }
    },
    2
  )
  return snapshot
}

const center = new p5.Vector(0, -CanvasSize / 80, 0)

export const draw3Dsnapshots = (snapshots: DataSnapshot[]) => {
  snapshots.forEach((snapshot, i) => {
    p.stroke(DrawGrayValue, 250 * Math.sin((Math.PI * i) / MaximumSnapshots))
    const finalVectors = snapshot.map((vector) =>
      vector
        .copy()
        .mult(BaseRadius * i)
        .add(center)
    )
    draw(finalVectors)
  })
}

const draw = (vectors: p5.Vector[]) => {
  loop(vectors.length, (i) => {
    if (vectors.length === i + 1) return
    drawLineBetweenVectors(vectors[i], vectors[i + 1] || vectors[0])
  })
}
