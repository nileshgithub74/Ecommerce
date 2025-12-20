import React from 'react'
import Hero from '../components/Hero'
import LatestCollections from '../components/LatestCollections'
import BestSellers from '../components/BestSellers'
import OurPolicy from '../components/OurPolicy'
import NewLetterBox from '../components/NewLetterBox'

const HomePage = () => {
  return (
    <div>

      <Hero/>
      <LatestCollections/>
      <BestSellers/>
      <OurPolicy/>
      <NewLetterBox/>
    </div>
  )
}

export default HomePage