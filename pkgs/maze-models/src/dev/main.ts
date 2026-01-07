import { GeometryPreviewer } from './preview'
import { ModelSize } from '../models'
import { generateFloatingBox } from '../models/generators/floatingBox'

const geo = generateFloatingBox(true)(ModelSize.Expand, 0)

new GeometryPreviewer(geo)
