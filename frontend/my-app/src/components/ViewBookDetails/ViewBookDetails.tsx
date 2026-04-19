'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'next/navigation';
import Loader from '../Loader/Loader';
import { FaHeart } from 'react-icons/fa6';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from "@/context/AuthContext";


type Book = {
  _id: string;
  title: string;
  price: number;
  url: string;
  author: string;
  desc?: string;
  language: string;
};

const ViewBookDetails = ({ params }: { params: { id: string } }) => {

    // const {id}= useParams();
    const { id } = params;
  const [book, setBook] = useState<Book | null>(null);
  const {isLoggedIn, role,loading } = useAuth();
  // const { user, token, isLoggedIn, role } = useAuth();
  const [liked, setLiked] = useState(false);
  // const { isLoggedIn, role } = useAuth();

// const user = JSON.parse(localStorage.getItem("user") || "{}");
const [favLoading, setFavLoading] = useState(false);
const [inCart, setInCart] = useState(false);


  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(
          `http://localhost:1000/api/v1/get-book-by-id/${params.id}`
        );

        setBook(res.data.book);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBook();
  }, [params.id]);


useEffect(() => {
  const checkFavourite = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:1000/api/v1/get-all-favourite-books",
        {
          headers: {
            id: user._id,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const exists = res.data.favourites.some(
        (item: any) => item._id === book?._id
      );

      // setLiked(exists);
      setFavLoading(exists); // ✅ sync loading with actual state
    } catch (err) {
      console.log(err);
    }
  };

  if (book) checkFavourite();
}, [book]);



  useEffect(() => {
  const checkCart = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:1000/api/v1/get-user-cart",
        {
          headers: {
            id: user._id,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const exists = res.data.cart.some(
        (item: any) => item._id === book?._id
      );

      setInCart(exists);
    } catch (err) {
      console.log(err);
    }
  };

  if (book) checkCart();
}, [book]);


  if (!book) {
    return <p className="text-white p-10">Loading...</p>;
  }
  if (loading) {
  return (
    <div className="h-screen flex items-center justify-center text-white">
      Loading...
    </div>
  );
}

const deleteBook = () => {
  // alert("Delete functionality coming soon!");
  const confirmDelete = window.confirm("Are you sure you want to delete this book?");
  if (confirmDelete) {
    // alert("Book deleted (not really, this is a placeholder)!");
    const token = localStorage.getItem("token");
    axios.delete(`http://localhost:1000/api/v1/delete-book/${book?._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert("Book deleted (not really, this is a placeholder)!");
  }

}

const editBook = () => {
  alert("Edit functionality coming soon!");
}

const handleFavourite = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!user?._id || !token) {
      alert("Please login first");
      return;
    }

    const url = favLoading
    // liked
      ? "http://localhost:1000/api/v1/remove-book-from-favourite"
      : "http://localhost:1000/api/v1/add-book-to-favourite";

    const res = await axios.put(
      url,
      {},
      {
        headers: {
          bookid: book?._id,
          id: user._id,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // setLiked(!liked);
    setFavLoading(!favLoading); // ✅ sync with actual state
    alert(res.data.message);

  } catch (err: any) {

    // ✅ HANDLE ALREADY EXISTS CASE
    if (err.response?.data?.message === "Book already in favourite") {
      alert("Already in favourites ❤️");
      // setLiked(true); // sync UI
      setFavLoading(!favLoading); // sync with actual state
      return;
    }

    console.log("ERROR:", err.response?.data || err.message);
    alert("Something went wrong");
  }
};



// const handleCart = async () => {
//   try {
//     const user = JSON.parse(localStorage.getItem("user") || "{}");
//     const token = localStorage.getItem("token");  
//     if (!user?._id || !token) {
//       alert("Please login first");
//       return;
//     }   
//     const url = inCart
//       ? `http://localhost:1000/api/v1/remove-book-from-cart/${book?._id}`
//       : "http://localhost:1000/api/v1/add-book-to-cart";
//       const res = inCart
//       ? await axios.put(
//           url,
//           {},
//           {
//             headers: {
//               id: user._id,
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         ) 
//       : await axios.post(
//           url,
//           { bookId: book?._id },
//           {
//             headers: {
//               id: user._id,
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         )
//       } catch (err: any) {
//     if (err.response?.data?.message === "Book already in cart") {
//       alert("Already in cart 🛒");
//       setInCart(true); // sync UI
//       return;
//     }
//     console.log("ERROR:", err.response?.data || err.message);
//     alert("Something went wrong");
//   }
//   setInCart(!inCart); // toggle state after successful API call
// };

const handleCart = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!user?._id || !token) {
      alert("Please login first");
      return;
    }

    const url = inCart
    // liked
      ? `http://localhost:1000/api/v1/remove-book-from-cart/${book?._id}`
      : "http://localhost:1000/api/v1/add-book-to-cart";

    const res = await axios.put(
      url,
      {},
      {
        headers: {
          bookid: book?._id,
          id: user._id,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // setLiked(!liked);
    setInCart(!inCart); // ✅ sync with actual state
    alert(res.data.message);

  } catch (err: any) {

    // ✅ HANDLE ALREADY EXISTS CASE
    if (err.response?.data?.message === "Book already in cart") {
      alert("Already in cart 🛒");
      // setLiked(true); // sync UI
      setInCart(!inCart); // sync with actual state
      return;
    }

    console.log("ERROR:", err.response?.data || err.message);
    alert("Something went wrong");
  }
};

return (
    <>
    
    
    {book && (
  <div className="px-4 md:px-12 py-8 bg-zinc-900 flex flex-col lg:flex-row gap-8 items-start">

    {/* LEFT SIDE */}
    <div className="w-full lg:w-1/2">

      <div className="relative flex justify-center bg-zinc-800 p-6 md:p-10 rounded">

        {/* Image */}
        <img
          src={book.url}
          alt={book.title}
          className="h-[40vh] md:h-[55vh] lg:h-[70vh] rounded object-cover"
        />

        {/*user controls*/}
{isLoggedIn && role === "user" && (
          <div 
          className="absolute right-3 top-3 flex flex-row md:flex-col gap-3">
            {/* ❤️ */}
            <button 
            onClick={handleFavourite} 
            className={`text-2xl p-2 md:p-3 rounded-full transition ${favLoading ? "bg-red-500 text-white" : "bg-white text-red-500 hover:bg-red-500 hover:text-white"}`}>
              <FaHeart />
            </button>
{/*  🛒  */}
            <button 
            onClick={handleCart}
  className={`text-2xl p-2 md:p-3 rounded-full transition
    ${inCart 
      ? "bg-blue-600 text-white" 
      : "bg-white text-blue-500 hover:bg-blue-600 hover:text-white"
    }
  `}>
              <FaShoppingCart />
            </button>

          </div>
)}

      </div>
    </div>

    {/* Admin Controls */}
 {role === "admin" && (
  <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">

    {/* ✏️ Edit */}
    <button onClick={editBook}
      className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-yellow-500 text-yellow-400 hover:text-white px-4 py-2 rounded-lg transition duration-300 w-full sm:w-auto"
    >
      ✏️ <span className="font-medium">Edit Book</span>
    </button>

    {/* 🗑 Delete */}
    <button onClick={deleteBook}
      className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-red-600 text-red-400 hover:text-white px-4 py-2 rounded-lg transition duration-300 w-full sm:w-auto"
    >
      🗑 <span className="font-medium">Delete Book</span>
    </button>

  </div>
)}
    {/* RIGHT SIDE */}
    <div className="w-full lg:w-1/2 p-2 md:p-4">

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-zinc-300">
        {book.title}
      </h1>

      <p className="mt-1 text-sm md:text-base text-zinc-400">
        by {book.author}
      </p>

      <p className="mt-4 text-zinc-500 text-sm md:text-lg">
        {book.desc || "No description available"}
      </p>

      <p className="mt-3 text-zinc-400 text-sm md:text-base">
        {book.language}
      </p>

      <p className="mt-4 text-2xl md:text-3xl font-semibold text-zinc-100">
        ₹ {book.price}
      </p>

    </div>

  </div>
)}
    {!book &&(
        <div className='flex items-center justify-center my-8 h-screen'>
        <Loader/>
        </div>
    )    }

    </>
  )
}

export default ViewBookDetails

// ViewBookDetails.tsx

// 'use client'

// import { useParams } from 'next/navigation'
// import { useEffect, useState } from 'react'
// import axios from 'axios'

// type Props = {
//   id: string;
// };

// const ViewBookDetails = ({ id }: Props) => {

//   const [book, setBook] = useState<any>(null);

//   useEffect(() => {
//     const fetchBook = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:1000/api/v1/get-book-by-id/${id}`
//         );
//         console.log("ID received:", id);
//         console.log("API response:", res.data);
//         setBook(res.data.book);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     if (id) fetchBook();
//   }, [id]);

//   if (!book) return <p className="text-white">Loading...</p>;
   
//   return (
//     <div className="text-white p-10">
//       <img src={book.url} alt={book.title} className="h-[300px]" />
//       <h1 className="text-3xl mt-4">{book.title}</h1>
//       <p className="mt-2">₹ {book.price}</p>
//     </div>
//   )
// }

// export default ViewBookDetails

// 'use client'

// import { useEffect, useState } from 'react'
// import axios from 'axios'

// const ViewBookDetails = ({ id }: { id: string }) => {

//   const [book, setBook] = useState<any>(null);

//   useEffect(() => {
//     const fetchBook = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:1000/api/v1/get-book-by-id/${id}`
//         );
//         console.log(res.data);
//         setBook(res.data.book); // change if needed
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchBook();
//   }, [id]);

//   if (!book) return <p className="text-white">Loading...</p>;

//   return (
//     <div className="text-white p-10">
//       <img src={book.url} className="h-[300px]" />
//       <h1>{book.title}</h1>
//       <p>₹ {book.price}</p>
//     </div>
//   )
// }

// export default ViewBookDetails