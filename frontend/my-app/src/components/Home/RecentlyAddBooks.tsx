// 'use client'

// import { useState } from 'react'
// import { useEffect } from "react";
// import axios from 'axios';
// import BookCart from '@/components/BookCard/BookCard';
// import Loader from '../Loader/Loader';


// type Book = {
//   _id: string;
//   title: string;
//   author: string;
//   price: number;
//   url: string;
// };

// const RecentlyAddBooks = () => {

//   // const [Data, setData] = useState();
//   const [Data, setData] = useState<Book[]>([]);
//   useEffect(() => {
//     const fetch = async () => {
//       try {
//         const response = await axios.get("http://localhost:1000/api/v1/get-recent-books");
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
//     <div className='mt-8 px-4'>
//       <h4 className='text-3xl text-yellow-100'>Recently books</h4>
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

// export default RecentlyAddBooks

'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import BookCart from '@/components/BookCard/BookCard'
import Loader from '../Loader/Loader'

type Book = {
  _id: string;
  title: string;
  author: string;
  price: number;
  url: string;
};

const RecentlyAddBooks = () => {
  const [Data, setData] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://localhost:1000/api/v1/get-recent-books")
        setData(response?.data?.books || [])
      } catch (error) {
        console.error("Error fetching books:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  return (
    <div className='mt-8 px-4'>
      <h4 className='text-3xl text-yellow-100'>Recently Books</h4>

      {/* ✅ Loader */}
      {loading && (
        <div className='flex items-center justify-center my-8'>
          <Loader />
        </div>
      )}

      {/* ✅ Grid */}
      <div className='my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
        {Data.map((item) => (
          <BookCart key={item._id} data={item} />
        ))}
      </div>
    </div>
  )
}

export default RecentlyAddBooks