import { GeometrySpec } from './types'
import { loadFileContent } from '../../utils/file'
import { parseObjData } from './parser/obj'

export const buildGeometrySpecFromObj = async (path: string): Promise<GeometrySpec> => {
  const objFileContent = await loadFileContent(path)
  return parseObjData(objFileContent)
}
