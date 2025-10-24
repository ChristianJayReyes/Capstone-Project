<<<<<<< HEAD
import React, { useState, useRef, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'

const NavBar = ({ onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className='flex items-center justify-between px-4 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
      
      {/* Left: Logo + Hamburger */}
      <div className='flex items-center gap-3'>
        <Link to='/'>
          <img src={assets.logoPicture} alt="logo" className='h-9 opacity-90'/>
        </Link>
        <button
          aria-label='Toggle sidebar'
          onClick={onToggleSidebar}
          className='p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
               fill="currentColor" className='w-6 h-6 text-gray-700'>
            <path d="M3 6h18M3 12h18M3 18h18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Right: Profile + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
        >
          <img 
            src={assets.userIcon}   // 👈 replace with your profile pic
            alt="profile" 
            className="w-9 h-9 rounded-full border"
          />
          <span className="text-gray-700 font-medium">John Doe</span>
          <svg className={`w-4 h-4 transform transition ${isOpen ? "rotate-180" : ""}`} 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
            <Link 
              to="/account" 
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaUser className='text-gray-500'/>
              Account
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaCog className='text-gray-500'/>
              Settings
            </Link>
            <button 
              onClick={() => alert("Logging out...")}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaSignOutAlt className='text-gray-500'/>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar
=======
import React, { useState, useRef, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'

const NavBar = ({ onToggleSidebar }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className='flex items-center justify-between px-4 border-b border-gray-300 py-3 bg-white transition-all duration-300'>
      
      {/* Left: Logo + Hamburger */}
      <div className='flex items-center gap-3'>
        <Link to='/'>
          <img src={assets.logoPicture} alt="logo" className='h-9 opacity-90'/>
        </Link>
        <button
          aria-label='Toggle sidebar'
          onClick={onToggleSidebar}
          className='p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" 
               fill="currentColor" className='w-6 h-6 text-gray-700'>
            <path d="M3 6h18M3 12h18M3 18h18" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Right: Profile + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition"
        >
          <img 
            src={assets.userIcon}   // 👈 replace with your profile pic
            alt="profile" 
            className="w-9 h-9 rounded-full border"
          />
          <span className="text-gray-700 font-medium">John Doe</span>
          <svg className={`w-4 h-4 transform transition ${isOpen ? "rotate-180" : ""}`} 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
            <Link 
              to="/account" 
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaUser className='text-gray-500'/>
              Account
            </Link>
            <Link 
              to="/settings" 
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaCog className='text-gray-500'/>
              Settings
            </Link>
            <button 
              onClick={() => alert("Logging out...")}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <FaSignOutAlt className='text-gray-500'/>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default NavBar
>>>>>>> b84fe5c (updated backend/reservation/admin-side)
