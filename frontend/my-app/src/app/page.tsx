
import React from 'react'
import Hero from '@/components/Home/Hero'
import RecentlyAddBooks from '@/components/Home/RecentlyAddBooks'

const HomePage = () => {
  return (
    <div className='bg-zinc-900 text-white px-10 py-8'>
      <Hero></Hero>
      <RecentlyAddBooks></RecentlyAddBooks>
    </div>
  )
}

export default HomePage;


