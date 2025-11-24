import React, { useState, useEffect } from 'react'
import { FaDownload, FaPlay, FaSearch, FaTimes } from "react-icons/fa";
import { bannerAssets } from '../../assets/dummydata'

function Banner() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showVideo, setShowVideo] = useState(false)
  const { bannerImage, orbitImages, video } = bannerAssets

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('bannerImage resolved ->', bannerImage)
      console.log('orbitImages resolved ->', orbitImages)
    }
  }, [bannerImage, orbitImages])

  // Prevent background scroll when video modal is open
  useEffect(() => {
    document.body.style.overflow = showVideo ? 'hidden' : 'auto'
  }, [showVideo])

  const bannerFallback = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='%232a1e1e'/><text x='50%' y='50%' fill='%23ffffff' font-size='18' font-family='Arial' dominant-baseline='middle' text-anchor='middle'>Image%20not%20available</text></svg>"

  const handleSearch = (e) => {
    e.preventDefault()
    console.log(searchQuery)
  }

  return (
    <div className='relative'>
      <div className='bg-gradient-to-br from-amber-900 via-amber-800 to-amber-700 text-white py-16 px-4 sm:px-8 relative overflow-hidden'>
        <div className='absolute inset-0 bg-gradient-to-r from-amber-900/20 to-amber-700/10' />

        <div className='max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12 relative z-10'>
          {/* LEFT CONTENT */}
          <div className='flex-1 space-y-8 relative md:pr-8 lg:pr-19 text-center md:text-left'>
            <h1 className='text-4xl sm:text-5xl md:text-4xl lg:text-6xl font-bold leading-tight font-serif drop-shadow-md'>
              We're here <br />
              <span className='text-amber-400 bg-gradient-to-r from-amber-400 to-amber-300 bg-clip-text'>
                For Food & Delivery
              </span>
            </h1>
            <p className='text-lg md:text-lg lg:text-xl font-playfair italic sm:text-xl text-amber-100 max-w-xl opacity-90 mx-auto md:mx-0'>
              Best cooks and best delivery guy all at your service. Hot tasty food will reach you in 60 minutes.
            </p>

            <form onSubmit={handleSearch} className='relative max-w-2xl mx-auto md:mx-0 group'>
              <div className='relative flex items-center bg-amber-900/30 rounded-xl border-2 border-amber-500 shadow-2xl hover:bg-amber-400/50 transition-all duration-300'>
                <div className='pl-6 pr-3 py-4'>
                  <FaSearch className='text-xl text-amber-400/30' />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='Discover your next favorite meal...'
                  className='w-full py-4 pr-6 bg-transparent outline-none placeholder-amber-200/70 text-lg font-medium tracking-wide'
                />
                <button className='mr-4 px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-300 rounded-lg font-semibold text-amber-900 hover:from-amber-300 hover:to-amber-200 transition-all duration-300 shadow-lg hover:shadow-amber-300/20'>
                  Search
                </button>
              </div>
            </form>

            <div className='flex flex-wrap gap-4 justify-center md:justify-start mt-6'>
              <button className='group flex items-center gap-3 bg-amber-800/30 hover:bg-amber-800/30 px-6 py-3 rounded-xl transition-all duration-300 border-2 border-amber-700/50 hover:border-amber-400 backdrop-blur-sm'>
                <FaDownload className='text-xl text-amber-400 group-hover:animate-bounce' />
                <span className='text-lg'>Download App</span>
              </button>

              <button
                onClick={() => setShowVideo(true)}
                className='group flex items-center gap-3 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 px-6 py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-amber-300/20'
              >
                <FaPlay className='text-xl text-amber-900' />
                <span className='text-lg text-amber-900 font-semibold'>Watch Video</span>
              </button>
            </div>
          </div>

          {/* RIGHT IMAGES CONTAINER WITH ORBITAL IMAGES */}
          <div className='flex-1 relative group mt-8 md:mt-0 min-h-[300px] sm:min-h-[400px]'>
            {/* MAIN IMG */}
            <div className='relative rounded-full p-1 bg-gradient-to-r from-amber-700 via-amber-800 to-amber-400 shadow-2xl z-20 w-[250px] xs:w-[300px] sm:w-[350px] h-[250px] xs:h-[300px] sm:h-[350px] mx-auto'>
              <img
                src={bannerImage}
                alt="Banner"
                onError={(e) => e?.target && (e.target.src = bannerFallback)}
                className='rounded-full border-4 xs:border-8 border-amber-900/50 w-full h-full object-cover object-top'
              />
              <div className='absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-amber-900/40 mix-blend-multiply' />
            </div>

            {/* ORBIT IMAGES */}
            {Array.isArray(orbitImages) && orbitImages.map((imgSrc, index) => (
              <div
                key={index}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${index === 0 ? 'orbit' : `orbit-delay-${index * 5}`} w-[80px] xs:w-[100px] sm:w-[150px] h-[80px] xs:h-[100px] sm:h-[150px]`}
              >
                <img
                  src={imgSrc}
                  alt={`Orbiting ${index + 1}`}
                  onError={(e) => e?.target && (e.target.src = bannerFallback)}
                  className='w-full h-full rounded-full border border-amber-500/30 bg-amber-900 p-1 object-cover'
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div className='fixed inset-0 flex items-center justify-center z-50 bg-black/90 backdrop-blur-lg p-4'>
          <button
            onClick={() => setShowVideo(false)}
            className='absolute top-6 right-6 text-amber-400 hover:text-amber-300 text-3xl z-10 transition-all'
          >
            <FaTimes />
          </button>
          <div className='w-full max-w-4xl mx-auto'>
            <video controls autoPlay className='w-full aspect-video object-contain rounded-lg shadow-2xl'>
              <source src={video} type='video/mp4' />
            </video>
          </div>
        </div>
      )}
    </div>
  )
}

export default Banner
