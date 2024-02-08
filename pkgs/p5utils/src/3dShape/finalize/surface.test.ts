import p5 from 'p5'
import { finalizeSurface } from './surface'

test(`${finalizeSurface.name}`, () => {
  const surface = [new p5.Vector(100, 0, 0), new p5.Vector(-100, 0, 0), new p5.Vector(0, 0, 0)]
  const spyVertex = jest.spyOn(p, 'vertex')
  finalizeSurface(surface)
  surface.forEach(v => {
    expect(spyVertex).toHaveBeenCalledWith(...v.array())
  })
})
