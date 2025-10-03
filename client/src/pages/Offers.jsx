import React from 'react'
import { assets } from '../assets/assets'

const Offers = () => {
  return (
    <div>
      <div style={{ backgroundImage: `url(${assets.poolers})` }} className='h-[750px] bg-cover bg-center flex items-center justify-center'></div>
      <div>
      <h1 className='text-4xl font-bold text-center mt-20 mb-10'>Special Offers</h1>
      <p className='text-lg text-center'>Check out our exclusive deals and packages designed to make your stay even more enjoyable.</p>
      </div>
    </div>
  )
}

export default Offers