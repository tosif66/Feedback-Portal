import React from 'react'
import Cards from './Cards'

const MainDash = () => {
  return (
    <div className="flex flex-col items-center md:items-start gap-8 w-full p-6  rounded-lg shadow-lg z-10">
  <h1 className="text-3xl font-bold w-full tracking-wide">Dashboard</h1>
  <div className="w-full">
    <Cards />
  </div>
</div>

  )
}

export default MainDash