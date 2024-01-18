import { convertTable } from './print'

test(`${convertTable.name}`, () => {
  const result = convertTable([
    { name: 'g1', length: 8, notes: 3 },
    { name: 'g2', length: 16, notes: 6 },
  ])
  expect(result).toMatchInlineSnapshot(`
    " name  length  notes 
     g1    8       3     
     g2    16      6     
    "
  `)
})
