import React, { useState, useEffect } from 'react'
import { FaArrowLeft, FaCheckCircle, FaEyeSlash, FaEye } from 'react-icons/fa'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

const url = 'https://foodiesweb-1.onrender.com'

const AwesomeToast = ({ message, icon }) => (
  <div className='animate-slide-in fixed bottom-6 right-6 flex items-center bg-gradient-to-br from-amber-500 to-amber-600
    px-6 py-4 rounded-lg shadow-lg border-2 border-amber-300/20'>
    <span className='text-2xl mr-3 text-[#2D1B0E]'>{icon}</span>
    <span className='font-semibold text-[#2D1B0E]'>{message}</span>
  </div>
)

function SignUp() {
  const [showToast, setShowToast] = useState({ visible: false, message: '', icon: null })
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ username: '', email: '', password: '' })
  const navigate = useNavigate()

  useEffect(() => {
    if (showToast.visible && showToast.message === 'Sign up Successfull') {
      const timer = setTimeout(() => {
        setShowToast({ visible: false, message: '', icon: null })
        navigate('/login')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [showToast, navigate])

  const toggleShowPassword = () => setShowPassword(prev => !prev)
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const res = await axios.post(`${url}/api/user/register`, formData)

      if (res.data.success) {
        setShowToast({
          visible: true,
          message: 'Sign up Successfull',   // FIXED TEXT
          icon: <FaCheckCircle />
        })
        return
      }

      throw new Error(res.data.message || 'Registration Failed')

    } catch (error) {
      const msg = error.response?.data?.message || error.message || 'Registration Failed'
      setShowToast({ visible: true, message: msg, icon: <FaCheckCircle /> })
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-[#1a120b] p-4'>
      {showToast.visible && <AwesomeToast message={showToast.message} icon={showToast.icon} />}

      <div className='w-full max-w-md bg-gradient-to-br from-[#2D1B0E] to-[#4a372a] p-8 rounded-xl shadow-lg
       border-4 border-amber-700/30'>
        <h1 className='text-3xl font-bold text-center bg-gradient-to-r from-amber-400 to-amber-600
           bg-clip-text text-transparent mb-6'>Create Account</h1>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input type="text" name="username" placeholder="Username"
            value={formData.username} onChange={handleChange}
            className='w-full px-4 py-3 rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400' required />

          <input type="email" name="email" placeholder="Email"
            value={formData.email} onChange={handleChange}
            className='w-full px-4 py-3 rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400' required />

          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password"
              value={formData.password} onChange={handleChange}
              className='w-full px-4 py-3 rounded-lg bg-[#2D1B0E] text-amber-100 placeholder-amber-400' required />

            <button type="button" onClick={toggleShowPassword}
              className='absolute inset-y-0 right-4 flex items-center text-amber-400'>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button type="submit"
            className='w-full py-3 bg-gradient-to-r from-amber-400 to-amber-600 text-[#2D1B0E] font-bold rounded-lg'>
            Sign Up
          </button>
        </form>

        <div className='mt-6 text-center'>
          <Link to="/login" className='text-amber-400 hover:text-amber-600'>
            <FaArrowLeft className='inline mr-2' />
            Back To Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SignUp
