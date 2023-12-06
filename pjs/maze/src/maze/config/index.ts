const defaultConf = (w = window) => ({
  ww: w.innerWidth,
  wh: w.innerHeight,
  frameInterval: 1000 / 24,
  mapSizing: w.innerWidth < 1000 ? 0.88 : 0.6,
  pictureMagnify: 0.75,
})

export const Conf = defaultConf()
