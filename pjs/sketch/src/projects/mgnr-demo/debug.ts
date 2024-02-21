import { CommandGrid, Scenes, Thresholds } from './control/commandGrid'

export const createManualCommandInvokeButtons = (activeCommands: CommandGrid, stillCommands: CommandGrid) => {
  const scenes: Scenes[] = ['loud', 'neutral', 'silent']
  const thresholds: Thresholds[] = [1, 2, 3, 4, 5]

  const debugDiv = document.createElement('div')
  debugDiv.style.position = 'fixed'
  debugDiv.style.top = '0'
  document.body.appendChild(debugDiv)

  const register = (commands: CommandGrid) => {
    scenes.forEach((scene) => {
      const row = debugDiv.appendChild(document.createElement('div'))
      thresholds.forEach((threshold) => {
        const btn = document.createElement('button')
        btn.innerText = `${scene} ${threshold}`
        btn.onclick = () => {
          commands[scene][threshold](20)
          commands['common'][threshold](20)
        }
        row.appendChild(btn)
      })
    })
  }
  register(activeCommands)
  register(stillCommands)
}
