'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext';

const Login = () => {

    const router = useRouter();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                'http://localhost:1000/api/v1/login',
                formData,
                // { withCredentials: true } // 🔥 VERY IMPORTANT
            );
            console.log(res.data);
            // console.log(res.data);

            // ✅ Save token (if backend sends it)
            // localStorage.setItem('token', res.data.token);

            // ✅ Redirect after login
            // router.push('/');


            // login(res.data.token, res.data.role, res.data);
            // localStorage.setItem('id', res.data.id); // 👈 ADD THIS
            login(res.data.token, res.data.role, { _id: res.data.id }); // ✅ PASS USER DATA

            // 🔥 store correct user manually
            localStorage.setItem("user", JSON.stringify({ _id: res.data.id }));
            // localStorage.setItem("user", JSON.stringify(res.data.user)); // ✅ MUST
            // localStorage.setItem("token", res.data.token); // ✅ MUST
            // localStorage.setItem('role', res.data.role);
            router.push('/');


        } catch (error: any) {
            //   console.error(error.response?.data || error.message);
            //   alert('Login failed');
            console.log("ERROR:", error.response?.data);
            alert(error.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className='min-h-screen bg-zinc-900 flex items-center justify-center px-12'>

            <div className='bg-zinc-800 rounded-lg px-8 py-6 w-full md:w-3/6 lg:w-2/6 shadow-lg'>

                <p className='text-zinc-200 text-2xl font-semibold text-center'>Login</p>

                <form onSubmit={handleSubmit} className='mt-6 flex flex-col gap-4'>

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

                    {/* Button */}
                    <button
                        type="submit"
                        className='bg-yellow-500 text-black py-2 rounded font-semibold hover:bg-yellow-400 transition'
                    >
                        Login
                    </button>

                </form>

                {/* Signup Redirect */}
                <p className='text-zinc-400 mt-4 text-sm text-center'>
                    Don’t have an account?{' '}
                    <Link href="/signup" className='text-yellow-400 hover:underline'>
                        Sign Up
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login