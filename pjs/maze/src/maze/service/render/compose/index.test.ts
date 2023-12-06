export {}
it(``, () => {})
// import { Node } from 'src/maze/domain/matrix/node'
// import { finalizeDrawSpecs } from 'src/maze/domain/vision/draw/drawSpec'
// import { createFrame } from 'src/maze/domain/vision/frame/helpers'
// import { Position } from 'src/maze/utils/position'
// import { composeRender } from '.'

// const magnifyRates = [1, 0.7, 0.3, 0.2, 0.09, 0.04, 0.02]

// const pos = [0, 0] as Position
// const n = new Node(pos, { n: true })
// const ne = new Node(pos, { n: true, e: true })
// const e = new Node(pos, { e: true })
// const we = new Node(pos, { w: true, e: true })
// const nwe = new Node(pos, { n: true, w: true, e: true })

// describe(`render`, () => {
//   const magnifyRates = [1, 0.7, 0.3, 0.2, 0.09, 0.04, 0.02]
//   const [w, h] = [1200, 800]
//   const f = magnifyRates.map((rate) => createFrame(w, h, [w * rate, h * rate]))
//   const draw = jest.fn()
//   const testRender = (nodes: Node[]) =>
//     finalizeDrawSpecs(f)(composeRender(nodes, 'n')) .forEach(draw)

//   describe(`corridor`, () => {
//     it(`pattern 1`, () => {
//       testRender([n, n, n])
//       expect(draw.mock.calls).toMatchSnapshot()
//     })

//     it(`pattern 2`, () => {
//       testRender([ne, n, n])
//       expect(draw.mock.calls).toMatchSnapshot()
//     })

//     it(`pattern 3`, () => {
//       testRender([nwe, n, n])
//       expect(draw.mock.calls).toMatchSnapshot()
//     })

//     it(`pattern 4`, () => {
//       testRender([n, we])
//       expect(draw.mock.calls).toMatchSnapshot()
//     })

//     it(`pattern 5`, () => {
//       testRender([n, n, we])
//       expect(draw.mock.calls).toMatchSnapshot()
//     })
//   })

//   describe(`blocked by wall`, () => {
//     it(`pattern 6`, () => {
//       testRender([we])
//       expect(draw.mock.calls).toMatchSnapshot()
//     })
//     it(`pattern 7`, () => {
//       testRender([nwe, e])
//       expect(draw.mock.calls).toMatchSnapshot()
//     })
//     it(`pattern 8`, () => {
//       testRender([nwe, we])
//       expect(draw.mock.calls).toMatchSnapshot()
//     })
//   })

//   describe(`stair`, () => {
//     it(`pattern 9`, () => {
//       const stairNode = new Node(pos, { s: true })
//       stairNode.setStair()
//       testRender([n, stairNode])
//       expect(draw.mock.calls).toMatchSnapshot()
//     })
//   })
// })
