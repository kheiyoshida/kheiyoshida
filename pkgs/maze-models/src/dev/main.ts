import { GeometryPreviewer } from './preview'
import { ModelSize } from '../models'
import { generatePole } from '../models/generators/pole'
import { generateFloatingBox } from '../models/generators/floatingBox'
import { generateTile } from '../models/generators/tile'
import { generateStackableBox } from '../models/generators/stackableBox'

// const geo = generateStackableBox({ stair: false })(ModelSize.Large,1)
const geo = generateTile(true)(ModelSize.Small,1)

new GeometryPreviewer(geo)
