export const Floor: React.FC = () => {
  return (
    <div
      id="floor"
      style={{
        position: 'fixed',
        top: '50vh',
        left: 'calc(50vw - 1.5rem)',
        visibility: 'hidden',
        fontSize: '1.5rem',
        color: 'white',
        opacity: 0,
      }}
    ></div>
  )
}

const interval = 100

export const renderFloor = (floor: number) => {
  const floorDiv = document.getElementById('floor')!
  floorDiv.innerText = `BF${floor}`
  floorDiv.style.visibility = 'visible'
  fadeIn()
}

const fadeIn = (durationMS = 2000) => {
  let timeElapsed = 0
  const timer = setInterval(() => {
    timeElapsed += interval
    const floorDiv = document.getElementById('floor')!
    floorDiv.style.opacity = `${timeElapsed / durationMS}`
    if (timeElapsed >= durationMS) {
      clearInterval(timer)
      fadeOut(durationMS)
    }
  }, interval)
}

const fadeOut = (durationMS = 1000) => {
  let timeLeft = Number(durationMS)
  const timer = setInterval(() => {
    timeLeft -= interval
    const floorDiv = document.getElementById('floor')!
    floorDiv.style.opacity = `${timeLeft / durationMS}`
    if (timeLeft <= 0) {
      hideFloor()
      clearInterval(timer)
    }
  }, interval)
}

const hideFloor = () => {
  const floorDiv = document.getElementById('floor')!
  floorDiv.style.visibility = 'hidden'
}
