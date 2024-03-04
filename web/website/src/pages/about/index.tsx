import { FlexibleImage } from '../../components/content/Image'
import { AboutContent } from '../../contents/about'
import { Links } from '../../contents/links'

export const About = () => {
  return (
    <div>
      <FlexibleImage path={AboutContent.photo} margin={false} />
      <div>{AboutContent.introduction.join(' ')}</div>
      <br />
      <div>
        Instagram: <a href={Links.instagram}>{AboutContent.username}</a>
      </div>
      <div>Mail: {AboutContent.contact}</div>
    </div>
  )
}

export default About
