// 'use client'
// import React from 'react'
// import { useState } from 'react'
// import { useEffect } from "react";
// import axios from 'axios'
// import Loader from '../Loader/Loader'
// import BookCart from '../BookCard/BookCard'

// type Book = {
//   _id: string;
//   title: string;
//   author: string;
//   price: number;
//   url: string;
// };

// const Books = () => {
//   const [Data, setData] = useState<Book[]>([]);
//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const response = await axios.get("http://localhost:1000/api/v1/get-all-books");
//         // console.log(response.data)
//         // setData(response.data.data)
//         setData(response?.data?.books || []);
//       }
//       catch (error) {
//         console.error("Error fetching books:", error);
//       }
//     };
//     fetch();
//   }, []);

//   return (
//     <div className='bg-zinc-900 px-12 py-8 h-auto'>
//       <h4 className='text-3xl text-yellow-100'>All Books</h4>
//       {!Data && (
//         <div className='flex items-center justify-center my-8'>
//           <Loader />
//         </div> )}
//       <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8'>
//         {Data &&
//           Data.map((items, i) => (
//             // <div key={i}>
//             <div key={items._id}>
//               <BookCart data={items} />
//             </div>
//           ))}
//       </div>

//     </div>
//   )
// }

// export default Books

'use client'

import { useEffect, useState } from "react";
import axios from 'axios';
import Loader from '../Loader/Loader';
import BookCard from '../BookCard/BookCard';

type Book = {
  _id: string;
  title: string;
  author: string;
  price: number;
  url: string;
};

const Books = () => {
  const [data, setData] = useState<Book[]>([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(
          "http://localhost:1000/api/v1/get-all-books"
        );

        console.log("Books:", res.data);

        setData(res.data.books || []);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className='bg-zinc-900 px-12 py-8 min-h-screen'>
      <h4 className='text-3xl text-yellow-100'>All Books</h4>

      {data.length === 0 ? (
        <div className='flex items-center justify-center my-8 text-white'>
          <Loader />
        </div>
      ) : (
        <div className='my-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-8'>
          {data.map((item) => (
            <div key={item._id}>
              <BookCard data={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Books;