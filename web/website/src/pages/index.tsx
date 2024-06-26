import { Feed } from '@/components/site/Feed'
import { PageTypeContext } from '@/lib/context'
import { GetStaticProps, NextPage } from 'next/types'
import { WorkEntities } from '../contents/works'
import { WorkPageInfo } from '../types'

interface HomePageProps {
  works: WorkPageInfo[]
}

const Home: NextPage<HomePageProps> = ({ works }) => {
  return (
    <>
      <PageTypeContext.Provider value={{ type: 'feed' }}>
        <Feed works={works} />
        <div style={{ height: '20vh' }}></div>
      </PageTypeContext.Provider>
    </>
  )
}

export const getStaticProps: GetStaticProps<HomePageProps> = () => {
  return {
    props: {
      works: WorkEntities,
    },
  }
}

export default Home
