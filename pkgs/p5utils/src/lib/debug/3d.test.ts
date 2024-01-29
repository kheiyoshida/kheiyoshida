import { create3dGrid, draw3DGrid } from './3d'

test(`${draw3DGrid.name}`, () => {
  const sphere = jest.spyOn(p, 'sphere').mockImplementation()
  draw3DGrid(3, 1000)
  expect(sphere).toHaveBeenCalledTimes(27)
})

test(`${create3dGrid.name}`, () => {
  const vectors = create3dGrid(3, 1000)
  expect(vectors[0].array()).toMatchObject([-1000, -1000, -1000])
  expect(vectors.map((v) => v.array().toString())).toMatchInlineSnapshot(`
    [
      "-1000,-1000,-1000",
      "-1000,-1000,0",
      "-1000,-1000,1000",
      "-1000,0,-1000",
      "-1000,0,0",
      "-1000,0,1000",
      "-1000,1000,-1000",
      "-1000,1000,0",
      "-1000,1000,1000",
      "0,-1000,-1000",
      "0,-1000,0",
      "0,-1000,1000",
      "0,0,-1000",
      "0,0,0",
      "0,0,1000",
      "0,1000,-1000",
      "0,1000,0",
      "0,1000,1000",
      "1000,-1000,-1000",
      "1000,-1000,0",
      "1000,-1000,1000",
      "1000,0,-1000",
      "1000,0,0",
      "1000,0,1000",
      "1000,1000,-1000",
      "1000,1000,0",
      "1000,1000,1000",
    ]
  `)
})
