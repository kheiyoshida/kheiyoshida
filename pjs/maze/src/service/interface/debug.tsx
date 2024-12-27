export const Debug = () => (
  <div id="debug" style={{ color: 'white', position: 'fixed', fontSize: 32, top: 0, left: 0 }}></div>
)

export const renderDebugText = (json: Record<string, unknown>) => {
  if (process.env.DEBUG === 'true') {
    document.getElementById('debug')!.innerText = Object.entries(json)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  }
}
