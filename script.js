import fs from 'fs'

const [workspaceDir] = process.argv.slice(2)
process.chdir(`${workspaceDir}/src`)

const subModules = fs.readdirSync('.')

subModules
  .filter(sm => sm !== 'index.ts') // entry file
  .forEach(sm => {
    const testMatch = new RegExp(`[^].test.ts`)
    const indexMatch = new RegExp(`index.ts`)
    const indexContent = fs.readdirSync(sm)
      .filter(fileName => !testMatch.test(fileName) && !indexMatch.test(fileName))
      .map(fileName => {
        const importPath = fileName.slice(0, -3) // rm .ts ext
        return `export * from './${importPath}'`
      })
      .join(`\n`)
    fs.writeFileSync(`./${sm}/index.ts`, indexContent)
  })
