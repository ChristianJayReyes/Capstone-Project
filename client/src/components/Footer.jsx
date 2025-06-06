import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='bg-[#171717] text-gray-500/80 pt-8 px-6 md:px-16 lg:px-24 xl:px-32'>
            <div className='flex flex-wrap justify-between gap-12 md:gap-6'>
                <div className='max-w-80'>
                    <img src={assets.logoPicture} alt="logo" className='mb-4 h-8 md:h-9'/>
                    <p className='text-sm'>
                        Discover and Experience the perfect blend of luxury and comfort at Rosario Resort and Hotel. Our city resort offers a unique escape, where modern amenities meet the vibrant energy of urban life. Whether you're here for business or leisure, we ensure an unforgettable stay with exceptional service and stunning surroundings.
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                        {/* Instagram */}
                        <img src={assets.instagramIcon} alt="instagram-Icon" className='w-6' />
                        {/* Facebook */}
                        <img src={assets.facebookIcon} alt="facebook-Icon" className='w-6'/>
                        {/* Twitter */}
                        <img src={assets.twitterIcon} alt="twitter-Icon" className='w-6'/>
                        {/* LinkedIn */}
                        <img src={assets.linkendinIcon} alt="linkedin-Icon" className='w-6'/>
                    </div>
                </div>

                <div>
                    <p className='font-playfair text-lg text-white-800'>COMPANY</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">About</a></li>
                        <li><a href="#">Careers</a></li>
                        <li><a href="#">Press</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div>
                    <p className='font-playfair text-lg text-white-800'>SUPPORT</p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Safety Information</a></li>
                        <li><a href="#">Cancellation Options</a></li>
                        <li><a href="#">Contact Us</a></li>
                        <li><a href="#">Accessibility</a></li>
                    </ul>
                </div>

                <div className='max-w-80'>
                    <p className='font-playfair text-lg text-white-800'>STAY UPDATED</p>
                    <p className='mt-3 text-sm'>
                        Subscribe to our newsletter for inspiration and special offers.
                    </p>
                    <div className='flex items-center mt-4'>
                        <input type="text" className='bg-white rounded-l border border-gray-300 h-9 px-3 outline-none' placeholder='Your email' />
                        <button className='flex items-center justify-center bg-black h-9 w-9 aspect-square rounded-r'>
                            {/* Arrow icon */}
                            <img src={assets.arrowIcon} alt="arrow-Icon" className='w-3.5 invert' />
                        </button>
                    </div>
                </div>
            </div>
            <hr className='border-gray-300 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} Rosario Resort and Hotel. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="https://www.google.com/maps/place/Rosario+Resort+and+Hotel+Grand+Pavilion/@13.8603049,121.2040629,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd14489170a66b:0xd45d9221f9f1ea35!8m2!3d13.8602997!4d121.2066378!16s%2Fg%2F11bw66s9rc?entry=ttu&g_ep=EgoyMDI1MDUxMy4xIKXMDSoASAFQAw%3D%3D" target='_blank'>Sitemap</a></li>
                </ul>
            </div>
        </div>
  )
}

export default Footer