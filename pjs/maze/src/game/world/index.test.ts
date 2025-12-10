import { WorldProvider } from './index.ts'
import { Structure } from './types.ts'

describe(`${WorldProvider.name}`, () => {
  it(`generates next world making sure structure changes every few levels`, () => {
    const worldProvider = new WorldProvider()

    worldProvider.generateWorld(1)

    const context = worldProvider.getStructureContext(1)
    expect(context).toMatchObject({
      prev: undefined,
      current: 'classic',
      next: expect.any(String)
    })

    worldProvider.generateWorld(1)
    worldProvider.generateWorld(1)
    expect(worldProvider.history.length).toBe(2)
    expect(worldProvider.getStructureContext(1)).toMatchObject(context)

    let prevStructure: Structure = worldProvider.getWorld(1).structure
    let same = 0
    for(let i = 2; i < 100; i++) {
      worldProvider.generateWorld(i)
      const structure = worldProvider.getWorld(i).structure

      if (prevStructure === structure) {
        same++
        if (same > 3) throw new Error(`Structure persisted more than 3 times in a row.`)
      } else {
        same = 0
      }

      prevStructure = structure
    }
  })
})
