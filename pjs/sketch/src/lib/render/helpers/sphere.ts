const TOTAL_LATITUDE = 180
const TOTAL_LONGTITUDE = 360
export const mapToSphere = (
  dataArray: number[],
  render: (theta: number, phi: number, data: number, percent: number) => void,
  spins = 10
) => {
  dataArray.forEach((data, i) => {
    const percent = i / dataArray.length
    const theta = TOTAL_LATITUDE * percent
    const phi = TOTAL_LONGTITUDE * spins * percent
    render(theta, phi, data, percent)
  })
}
