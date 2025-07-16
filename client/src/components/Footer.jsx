import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer class="px-6 md:px-16 lg:px-24 xl:px-32 pt-8 w-full text-gray-500 bg-gray-300/50">
    <div class="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500/30 pb-6">
        <div class="md:max-w-96">
            <img class="h-9" src={assets.logoPicture} />
            <p class="mt-6 text-sm">
                Discover and Experience the perfect blend of luxury and comfort at Rosario Resort and Hotel. 
                Our city resort offers a unique escape, where modern amenities meet the vibrant energy of urban life. 
                Whether you're here for business or leisure, we ensure an unforgettable stay with exceptional service and stunning surroundings.
            </p>
        </div>
        <div class="flex-1 flex items-start md:justify-end gap-20">
            <div>
                <h2 class="font-semibold mb-5 text-gray-800">Company</h2>
                <ul class="text-sm space-y-2">
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">Privacy policy</a></li>
                </ul>
            </div>
            <div>
                <h2 class="font-semibold mb-5 text-gray-800">Get in touch</h2>
                <div class="text-sm space-y-2">
                    <p>0949-990-6350 / 0977-806-4396</p>
                    <p>sales.rosarioresort@gmail.com</p>
                </div>
            </div>
        </div>
    </div>
    <p class="pt-4 text-center text-xs md:text-sm pb-5">
        Copyright 2025 © Rosario Resort and Hotel. All Right Reserved.
    </p>
</footer>
  )
}

export default Footer