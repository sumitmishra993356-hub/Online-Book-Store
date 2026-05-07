'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { FaGripLines } from 'react-icons/fa';
import { log } from 'console';

const Navbar = () => {

    const [MobileNav, setMobileNav] = useState("hidden");
    const { isLoggedIn, logout, role } = useAuth();




    // ✅ Links based on login
    const links = [
        { name: "Home", href: "/" },
        { name: "About", href: "/about" },
        { name: "Books", href: "/books" },
        ...(isLoggedIn ? [
            // { name: "Cart", href: "/cart" },
            // { name: "Profile", href: "/profile" },
            ...(role === "admin" ? [{ name: "Admin", href: "/admin" }] :
                [{ name: "Cart", href: "/cart" },
                { name: "Profile", href: "/profile" }
                ])
        ] : [])
    ];

    return (
        <>
            <nav className='z-50 relative flex bg-zinc-800 text-white px-8 py-4 items-center justify-between'>

                <Link href="/" className='flex items-center'>
                    <img className='h-10 me-4' src="/logo.png" alt="logo" />
                    <h1 className='text-2xl font-semibold'>Shopiko</h1>
                </Link>

                <div className='block md:flex items-center space-x-4'>

                    {/* Desktop Links */}
                    <div className='hidden md:flex space-x-4'>
                        {links.map((link) => (
                            <Link key={link.name} href={link.href} className='hover:text-blue-500'>
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* admin only */}
                    {/* <div className='hidden md:flex space-x-4'>
                        {role === "admin" && (
                        <Link href="/admin" className='hover:text-blue-500'>Admin</Link>
                    )}
                    </div> */}


                    {/* Auth Buttons */}
                    <div className='hidden md:flex space-x-4'>
                        {!isLoggedIn ? (
                            <>
                                <Link href="/login" className='border border-blue-500 px-2 py-1 rounded'>
                                    Login
                                </Link>
                                <Link href="/signup" className='bg-blue-500 px-2 py-1 rounded'>
                                    Sign Up
                                </Link>
                            </>
                        )
                            : (
                                // <button className='bg-red-400 border border-yellow-600 px-2 py-1 rounded' onClick={logout}>
                                //     Logout
                                // </button>
                                <>
                                </>

                            )
                        }
                    </div>

                    {/* Mobile Button */}
                    <button
                        className='md:hidden text-2xl'
                        onClick={() => setMobileNav(MobileNav === "hidden" ? "block" : "hidden")}
                    >
                        <FaGripLines />
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`${MobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}>

                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className='text-white text-4xl mb-8'
                        onClick={() => setMobileNav("hidden")}
                    >
                        {link.name}
                    </Link>
                ))}

                {!isLoggedIn ? (
                    <>
                        <Link href="/login" className='mb-8 text-3xl text-white border px-8 py-2'>
                            Login
                        </Link>
                        <Link href="/signup" className='text-3xl text-white bg-blue-500 px-8 py-2'>
                            Sign Up
                        </Link>
                    </>
                ) :
                    (
                        // <button className='bg-red-400 border border-yellow-600 px-2 py-1 rounded' onClick={logout}>
                        //     Logout
                        // </button>
                        <>
                        </>
                    )
                }
            </div>
        </>
    )
}

export default Navbar;