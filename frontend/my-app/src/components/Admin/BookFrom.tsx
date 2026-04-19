


'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminSidebar from '@/components/Admin/AdminSideber'

const BookForm = () => {
  const [books, setBooks] = useState<any[]>([])
  const [form, setForm] = useState({
    title: "",
    // price: 0,
     price: "",   // 🔥 change this
    url: "",
    author: "",
    desc: "",
    language: ""
  });

  // 📚 Fetch Books
  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost:1000/api/v1/get-all-books");
      setBooks(res?.data?.data || res?.data?.books || []);
    } catch (err) {
      console.log(err);
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchBooks()
  }, [])

  // ❌ Delete Book (FIXED: added token)
  const deleteBook = async (id: string) => {
    try {
      const token = localStorage.getItem("token")

      await axios.delete(
        `http://localhost:1000/api/v1/delete-book/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchBooks()
    } catch (err: any) {
      console.log("DELETE ERROR:", err?.response?.data || err.message)
    }
  }

  // ➕ Add Book
  const addBook = async () => {
    try {
      const token = localStorage.getItem("token")
      const user = JSON.parse(localStorage.getItem("user") || "{}")

      await axios.post(
        "http://localhost:1000/api/v1/add-book",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: user._id
          }
        }
      )

      fetchBooks()
      alert("Book added")
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-zinc-900 text-white">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 p-3 sm:p-6">

        <h1 className="text-2xl font-bold mb-4">Manage Books</h1>

        {/* ADD BOOK */}
        <div className="bg-zinc-800 p-4 rounded mb-6 space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full p-2 bg-zinc-700 rounded"
          />

          <input
            type="text"
            placeholder="Author"
            value={form.author}
            onChange={e => setForm({ ...form, author: e.target.value })}
            className="w-full p-2 bg-zinc-700 rounded"
          />

          <input
            type="text"
            placeholder="Description"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="w-full p-2 bg-zinc-700 rounded"
          />

          <input
            type="text"
            placeholder="Language"
            value={form.language}
            onChange={(e) => setForm({ ...form, language: e.target.value })}
            className="w-full p-2 bg-zinc-700 rounded"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={e => setForm({ ...form, price: e.target.value })}
            className="w-full p-2 bg-zinc-700 rounded"
          />

          <input
            type="text"
            placeholder="Image URL"
            value={form.url}
            onChange={e => setForm({ ...form, url: e.target.value })}
            className="w-full p-2 bg-zinc-700 rounded"
          />

          <button
            onClick={addBook}
            className="bg-yellow-500 px-4 py-2 rounded text-black w-full sm:w-auto"
          >
            Add Book
          </button>
        </div>

        {/* BOOK LIST */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book: any) => (
            <div key={book._id}
              className="bg-zinc-800 p-4 rounded flex flex-col items-center h-full"
            >
              <img
                src={book.url}
                // className="h-32 sm:h-40 w-full object-cover rounded "
                className='h-[25vh] sm:h-[30vh]  object-cover rounded'
                alt={book.title}
              />

              <h3 className="mt-2 font-semibold">{book.title}</h3>

              <button
                onClick={() => {
                  if (!confirm("Delete this book?")) return
                  deleteBook(book._id)
                }}
                // className="bg-red-500 px-3 py-1 mt-2 rounded w-full"
                className="mt-auto bg-red-500 hover:bg-red-600 px-3 py-1 rounded w-full"
              >
                Delete
              </button>

            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default BookForm