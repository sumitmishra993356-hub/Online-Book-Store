import React from 'react'
import Link from "next/link";


const Hero = () => {
    return (
        <div className='h-[75vh] flex flex-col md:flex-row items-center justify-center'>
            <div className='mb-12 md:mb-0 flex flex-col justify-center items-center lg:items-start w-full lg:w-3/6'>
                <h1 className='text-4xl lg:text-6xl font-semibold text-yellow-100 text-center lg:text-left '>Discover Your Next Favorite Book
                </h1>
                <p className='text-xl text-zinc-300 mt-4 text-center lg:text-left'>Explore our vast collection of books and find your next great read. From bestsellers to hidden gems, we have something for every book lover.
                </p>
                <div className='mt-8'>
                    <Link href={"/books"} className='text-yellow-100 text-xl lg:text-2xl font-semibold border border-yellow-100 px-10 py-3 hover:bg-zinc-800 rounded-full '>Shop Now</Link>
                </div>
                
            </div>
            <div className='w-full lg:w-3/6 h-auto lg:h-full flex items-center justify-center'>
                <img 
                src="./hero-image.png" 
                alt="hero" />
            </div>
        </div>
    )
}

export default Hero;
