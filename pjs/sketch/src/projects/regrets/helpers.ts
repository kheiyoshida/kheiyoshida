import p5 from "p5";
import { extractNodeSurfaceVertices } from "p5utils/src/3dShape/finalize/node";
import { finalizeSurface } from "p5utils/src/3dShape/finalize/surface";
import { Model } from "./model";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type pExtended = p5 & { beginGeometry: any; endGeometry: any }

export const finalizeGeometry = (model: Model): p5.Geometry => {
  // eslint-disable-next-line no-extra-semi
  ;(p as pExtended).beginGeometry()
  const surfaces = extractNodeSurfaceVertices(model)
  surfaces.forEach((s) => finalizeSurface(...s))
  return (p as pExtended).endGeometry()
}
