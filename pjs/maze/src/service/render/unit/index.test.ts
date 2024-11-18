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
        // codes: [GeometryCode.RightWall], doesn't have to include FrontWall
        codes: [GeometryCode.FrontWall, GeometryCode.RightWall],
        position: {
          x: 0,
          z: 0,
        },
      },
      {
        codes: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 1,
          z: 0,
        },
      },
      {
        codes: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 2,
          z: 0,
        },
      },

      //
      {
        // codes: [GeometryCode.RightWall], // doesn't have to include FrontWall
        codes: [GeometryCode.FrontWall, GeometryCode.RightWall],
        position: {
          x: 0,
          z: 1,
        },
      },
      {
        codes: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 1,
          z: 1,
        },
      },
      {
        codes: [GeometryCode.FrontWall, GeometryCode.LeftWall], // should have FrontWall since there's nothing hiding this
        position: {
          x: 2,
          z: 1,
        },
      },

      //
      {
        codes: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 0,
          z: 2,
        },
      },
      {
        codes: [GeometryCode.Floor, GeometryCode.Ceil],
        position: {
          x: 1,
          z: 2,
        },
      },
      {
        // codes: [GeometryCode.LeftWall], // shouldn't have FrontWall
        codes: [GeometryCode.FrontWall, GeometryCode.LeftWall],
        position: {
          x: 2,
          z: 2,
        },
      },

      // dead end
      {
        // codes: [GeometryCode.FrontWall], // shouldn't have RightWall
        codes: [GeometryCode.FrontWall, GeometryCode.RightWall],
        position: {
          x: 0,
          z: 3,
        },
      },
      {
        codes: [GeometryCode.FrontWall],
        position: {
          x: 1,
          z: 3,
        },
      },
      {
        // codes: [], // shouldn't have LeftWall and FrontWall
        codes: [GeometryCode.FrontWall, GeometryCode.LeftWall],
        position: {
          x: 2,
          z: 3,
        },
      },
    ])
  })
})
