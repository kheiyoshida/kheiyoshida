import p5 from 'p5'

export const make3DPositionWobbler = (
  wobbleAmount: number,
  initialPosition: [number, number, number] = [0, 0, 0]
) => {
  let position: p5.Vector
  const getPosition = () => {
    if (!position) {
      position = new p5.Vector(...initialPosition)
    }
    return position
  }
  return {
    get current(): p5.Vector {
      return getPosition()
    },
    renew() {
      getPosition().add(p5.Vector.random3D().mult(wobbleAmount))
    },
  }
}
