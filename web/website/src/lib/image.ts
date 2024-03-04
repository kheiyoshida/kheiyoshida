const IMGKIT = 'https://ik.imagekit.io/72lduu8js'

export const resolveImagekitPath = (...paths: string[]) => IMGKIT + '/' + paths.join('/')

export const retrieveImgAlt = (path: string) => {
  const p = path.split('/')
  return p[p.length - 1]
}
