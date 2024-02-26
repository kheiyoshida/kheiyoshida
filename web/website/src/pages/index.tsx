import { Feed } from '@/components/site/Feed'
import { PageTypeContext } from '@/lib/context'
import { GetStaticProps, NextPage } from 'next/types'
import { WorkEntities } from '../contents'

interface HomePageProps {
  works: Work[]
}

const Home: NextPage<HomePageProps> = ({ works }) => {
  return (
    <>
      <PageTypeContext.Provider value={{ type: 'feed' }}>
        <Feed works={works} />
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
