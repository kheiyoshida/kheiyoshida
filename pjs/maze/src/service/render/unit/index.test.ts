import { convertRenderGridToUnitSpecList } from './index'
import { RenderGrid } from '../../../domain/translate/renderGrid/renderSpec.ts'
import { GeometryCode } from './types.ts'

describe(`${convertRenderGridToUnitSpecList.name}`, () => {
  it(`should convert render grid to unit spec list following visibility constraints`, () => {
    /**
     * X X X <- side walls within the wall doesn't need to be rendered
     * - - X
     * X - X <- wall on right side doesn't need front wall since it's hidden anyway
     * X - - <- the most front doesn't have to render the front wall since it's invisible
     * front
     */
    const renderGrid: RenderGrid = [
      null,
      null, // RenderGrid always comes with null layers
      [1, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
      [1, 0, 0],
    ] // TODO: reverse() this test data after removing reverse() in the pipeline

    const result = convertRenderGridToUnitSpecList(renderGrid)

    // TODO: adjust expected codes after performance tuning
    expect(result).toEqual([
      //
      {
        // keys: [GeometryCode.RightWall], doesn't have to include FrontWall
        keys: [GeometryCode.FrontWall, GeometryCode.RightWall],
        position: {
          x: 0,
          z: 0,
        },
      },
      {
        keys: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 1,
          z: 0,
        },
      },
      {
        keys: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 2,
          z: 0,
        },
      },

      //
      {
        // keys: [GeometryCode.RightWall], // doesn't have to include FrontWall
        keys: [GeometryCode.FrontWall, GeometryCode.RightWall],
        position: {
          x: 0,
          z: 1,
        },
      },
      {
        keys: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 1,
          z: 1,
        },
      },
      {
        keys: [GeometryCode.FrontWall, GeometryCode.LeftWall], // should have FrontWall since there's nothing hiding this
        position: {
          x: 2,
          z: 1,
        },
      },

      //
      {
        keys: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 0,
          z: 2,
        },
      },
      {
        keys: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 1,
          z: 2,
        },
      },
      {
        // keys: [GeometryCode.LeftWall], // shouldn't have FrontWall
        keys: [GeometryCode.FrontWall, GeometryCode.LeftWall],
        position: {
          x: 2,
          z: 2,
        },
      },

      // dead end
      {
        // keys: [GeometryCode.FrontWall], // shouldn't have RightWall
        keys: [GeometryCode.FrontWall, GeometryCode.RightWall],
        position: {
          x: 0,
          z: 3,
        },
      },
      {
        keys: [GeometryCode.FrontWall],
        position: {
          x: 1,
          z: 3,
        },
      },
      {
        // keys: [], // shouldn't have LeftWall and FrontWall
        keys: [GeometryCode.FrontWall, GeometryCode.LeftWall],
        position: {
          x: 2,
          z: 3,
        },
      },
    ])
  })
})
