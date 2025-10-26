import { convertToPoles } from './poles.ts'
import { LogicalView } from '../../../index.ts'

describe(`${convertToPoles.name}`, () => {
  it(`converts render patterns to geometry codes in poles style`, () => {
    const grid: LogicalView = [
      [null, null, null],
      [null, null, null],
      [1, 1, 1],
      [0, 0, 1],
      [1, 0, 1],
      [1, 0, 0],
    ].reverse() as LogicalView

    const {grid: codeGrid} = convertToPoles(grid)
    expect(codeGrid).toEqual([
      [[], [], []],
      [[], [], []],
      [['Pole'], ['Pole'], ['Pole']],
      [[], [], ['Pole']],
      [['Pole'], [], ['Pole']],
      [['Pole'], [], []],
    ].reverse())
  })

  it(`puts extra poles beyond the stair position`, () => {
    const grid: LogicalView = [
      [null, null, null],
      [null, null, null],
      [1, 1, 1],
      [1, 2, 1],
      [1, 0, 1],
      [1, 0, 0],
    ].reverse() as LogicalView

    const {grid: codeGrid} = convertToPoles(grid)
    expect(codeGrid).toEqual([
      [['Pole'], [], ['Pole']],
      [['Pole'], [], ['Pole']],
      [['Pole'], [], ['Pole']], // open the path
      [['Pole'], [], ['Pole']], // stair
      [['Pole'], [], ['Pole']],
      [['Pole'], [], []],
    ].reverse())

    const grid2: LogicalView = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [null, null, null],
      [1, 1, 1],
      [1, 2, 1],
    ].reverse() as LogicalView

    const { grid: codeGrid2 } = convertToPoles(grid2)
    expect(codeGrid2).toEqual([
      [['Pole'], [], ['Pole']],
      [['Pole'], [], ['Pole']],
      [['Pole'], [], ['Pole']],
      [['Pole'], [], ['Pole']],
      [['Pole'], [], ['Pole']], // open the path
      [['Pole'], [], ['Pole']], // stair
    ].reverse())
  })
})
