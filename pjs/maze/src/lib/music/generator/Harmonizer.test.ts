export {}
it.todo('')
// describe(`Harmonizer`, () => {
//   it(`can harmonize note by degree`, () => {
//     const scale = new Scale({})
//     const picker = new NotePicker({}, scale)
//     const note = {
//       pitch: 60,
//       dur: 1,
//       vel: 100
//     }
//     const res = picker.harmonize(note, '5')
//     expect(res).toMatchObject({
//       ...note,
//       pitch: 67,
//     })
//   })
//   it(`can adjust degree if there's none matching in the scale`, () => {
//     const scale = new Scale({})
//     const picker = new NotePicker({}, scale)
//     const note = {
//       pitch: 60,
//       dur: 1,
//       vel: 100
//     }
//     const res = picker.harmonize(note, 'b5')
//     expect(res).toMatchObject({
//       ...note,
//       pitch: 67,
//     })
//   })
//   it(`can force picking Nth degree note`, () => {
//     const scale = new Scale({})
//     const picker = new NotePicker({
//       harmonize: {
//         degree: [],
//         force: true,
//         lookDown: true,
//       }
//     }, scale)
//     const note = {
//       pitch: 60,
//       dur: 1,
//       vel: 100
//     }
//     const res = picker.harmonize(note, 'b5', {force: true})
//     expect(res).toMatchObject({...note, pitch: 66})
//   })
//   it(`can look down the scale for the Nth degree note`, () => {
//     const scale = new Scale({})
//     const picker = new NotePicker({}, scale)
//     const note = {
//       pitch: 60,
//       dur: 1,
//       vel: 100
//     }
//     const res = picker.harmonize(note, '5', {lookDown: true})
//     expect(res).toMatchObject({...note, pitch: 53})
//   })

// })