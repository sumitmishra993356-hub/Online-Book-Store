import React from 'react'
import Link from 'next/link'

type Book = {
  _id: string;
  title: string;
  author: string;
  price: number;
  url: string;
};

type Props = {
  data: Book;
};

const BookCart = ({ data }: Props) => {
    // console.log(data)
  return (
    <>
     <Link href={`/book/${data._id}`}>
     <div className='bg-zinc-800 rounded p-4 flex flex-col h-full hover:scale-105 hover:shadow-lg transition duration-300'>
      <div className='bg-zinc-900 rounded flex items-center justify-center h-[25vh]'>
        <img src={data.url} 
            alt={data.title}  
            className='h-[25vh]' />
      </div>
      <h2 className='mt-4 text-xl font-semibold text-white line-clamp-2'>{data.title}</h2>
      <p className='mt-2 text-zinc-400 font-semibold'>{data.author}</p>
      <p className='mt-2 text-zinc-200 font-semibold text-xl'>
        ₹ {data.price}
      </p>
     </div>
     </Link>
    </>
  )
}

export default BookCart
