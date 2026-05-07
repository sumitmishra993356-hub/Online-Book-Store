'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

const Signup = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    address: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    // 👉 connect backend here
    try {
      const res = await axios.post(
        'http://localhost:1000/api/v1/sign-up',
        formData
      );

      alert(res.data.message);

      // redirect to login
      router.push('/login');

    } catch (error: any) {
      console.log("ERROR:", error.response?.data);
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className='min-h-screen bg-zinc-900 px-12 py-8 flex items-center justify-center'>

      <div className='bg-zinc-800 rounded-lg px-8 py-6 w-full md:w-3/6 lg:w-2/6 shadow-lg'>

        <p className='text-zinc-200 text-2xl font-semibold text-center'>Sign Up</p>

        <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-4'>

          {/* Username */}
          <div>
            <label className='text-zinc-400'>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none rounded'
              placeholder='Enter username'
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className='text-zinc-400'>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none rounded'
              placeholder='Enter email'
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className='text-zinc-400'>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none rounded'
              placeholder='Enter password'
              required
            />
          </div>

          {/* Address */}
          <div>
            <label className='text-zinc-400'>Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className='w-full mt-2 bg-zinc-900 text-zinc-100 p-2 outline-none rounded'
              placeholder='Enter address'
              rows={3}
              required
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className='bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-400 transition'
          >
            Sign Up
          </button>

        </form>

        {/* Login Redirect */}
        <p className='text-zinc-400 mt-4 text-sm text-center'>
          Already have an account?{' '}
          <Link href="/login" className='text-yellow-400 hover:underline'>
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Signup