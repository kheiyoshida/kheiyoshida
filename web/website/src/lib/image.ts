import path from 'path'

const IMGKIT = 'https://ik.imagekit.io/72lduu8js'
const worksPath = '/works'

export const resolveImagekitPath = (imagePaths: string[], workDate: string) => {
  return imagePaths.map((p) => IMGKIT + path.join(worksPath, workDate, p))
}

export const retrieveImgAlt = (path: string) => {
  const p = path.split('/')
  return p[p.length - 1]
}

export const retrieveImgLink = (img: string) => {
  const p = img.split('/')
  try {
    return path.join(
      p[p.length - 3], // work
      p[p.length - 2] // YYMMDD
    )
  } catch (e) {
    console.error(img)
    throw e
  }
}
