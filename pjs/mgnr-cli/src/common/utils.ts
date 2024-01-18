export function suspicious(cb: () => void) {
  try {
    cb()
  } catch (err) {
    console.error(err)
  }
}
