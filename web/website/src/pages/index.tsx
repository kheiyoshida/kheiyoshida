import { Feed } from "@/components/Feed"
import { PageTypeContext } from "@/lib/context"
import { resolveWorkInfo } from "@/lib/image"
import workEntities from "@/works"
import { GetStaticProps, NextPage } from "next/types"


interface HomePageProps {
  works: Work[]
}

const Home: NextPage<HomePageProps> = ({works}) => {
  return (
    <>
      <PageTypeContext.Provider value={{type: 'feed'}}>
        <Feed works={works}/>
      </PageTypeContext.Provider>
    </>
  )
}

export const getStaticProps:GetStaticProps<HomePageProps> = () => {

  const works = workEntities.map(w => resolveWorkInfo(w))

  return {
    props: {
      works
    }
  }
}

export default Home