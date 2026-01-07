import { GeometryPreviewer } from './preview'
import { ModelSize } from '../models'
import { generatePole } from '../models/generators/pole'
import { generateFloatingBox } from '../models/generators/floatingBox'
import { generateTile } from '../models/generators/tile'

const geo = generateTile(true)(ModelSize.Medium, 1)

new GeometryPreviewer(geo)
