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
                    <li><a href="/">Home</a></li>
                    <li><a href="/about">About us</a></li>
                    <li><a href="#">Contact us</a></li>
                    <li><a href="#">Privacy policy</a></li>
                    <li><a href="https://www.google.com/maps/place/Rosario+Resort+and+Hotel+Grand+Pavilion/@13.8603049,121.2040629,17z/data=!3m1!4b1!4m6!3m5!1s0x33bd14489170a66b:0xd45d9221f9f1ea35!8m2!3d13.8602997!4d121.2066378!16s%2Fg%2F11bw66s9rc?entry=ttu&g_ep=EgoyMDI1MDcxNi4wIKXMDSoASAFQAw%3D%3D" target='_blank'>Location</a></li>
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