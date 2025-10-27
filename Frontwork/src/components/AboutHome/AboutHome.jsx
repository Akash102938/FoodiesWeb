import React from 'react'

function AboutHome() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0f0a0a] via-[#1a1212] to-[#2a1e1e] text-white py-10 sm:py-20 relative overflow-hidden'>
      {/* Background glows */}
      <div className='absolute top-0 left-0 w-full opacity-10 pointer-events-none'>
        <div className='absolute top-1/4 left-20 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl mix-blend-soft-light' />
        <div className='absolute bottom-0 right-0 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl mix-blend-soft-light' />
      </div>

      {/* Content section */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center lg:gap-8 xl:gap-16 relative'>
        <div className='w-full order-1 lg:order-2 space-y-8 sm:space-y-12 relative'>
          <div className='space-y-4 sm:space-y-8 px-4 sm:px-0'>
            <h2 className='text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold leading-tight'>
              <span className='font-cursive text-4xl sm:text-5xl md:text-6xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent'>
                Epicurean Elegance
              </span>
              <br />
              <span className='inline-block mt-2 sm:mt-4 text-2xl sm:text-3xl md:text-4xl opacity-90 font-light'>
                Where Flavours Dance &amp; Memories Bloom
              </span>
            </h2>

            <p className='text-base sm:text-lg md:text-xl opacity-90 leading-relaxed max-w-3xl font-serif italic border-l-4 border-amber-500/60 pl-4 sm:pl-6 py-2 bg-gradient-to-r from-white/5 to-transparent'>
              "In our kitchen, passion meets precision. We craft not just meals, but culinary journeys
              that linger on the palate and in the heart."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutHome
