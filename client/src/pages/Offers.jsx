import React from 'react'
import { assets } from '../assets/assets'
import { motion } from "framer-motion"

const Offers = () => {
  return (
    <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration:1}}
    >
      <div style={{ backgroundImage: `url(${assets.poolers})` }} className='h-[750px] bg-cover bg-center flex items-center justify-center'></div>
      <div>
      <h1 className='text-4xl font-bold text-center mt-20 mb-10'>Special Offers</h1>
      <p className='text-lg text-center'>Check out our exclusive deals and packages designed to make your stay even more enjoyable.</p>
      </div>
    </motion.div>
  )
}

export default Offers