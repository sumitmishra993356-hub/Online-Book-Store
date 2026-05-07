

'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

const DashboardCards = () => {

  const [stats, setStats] = useState({
    users: 0,
    books: 0,
    orders: 0
  })

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token")

      const usersRes = await axios.get(
        "http://localhost:1000/api/v1/get-all-users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: "admin"
          }
        }
      )

      const booksRes = await axios.get(
        "http://localhost:1000/api/v1/get-all-books"
      )

      const ordersRes = await axios.get(
        "http://localhost:1000/api/v1/get-all-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: "admin"
          }
        }
      )

      setStats({
        users: usersRes.data?.users?.length || 0,
        books: booksRes.data?.books?.length || 0,
        orders:
          ordersRes.data?.data?.length ||
          ordersRes.data?.orders?.length ||
          0
      })

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

      {/* USERS */}
      <div className="bg-zinc-800 p-4 sm:p-6 rounded-xl shadow-md hover:scale-[1.02] transition">
        <h2 className="text-sm sm:text-base text-zinc-400">Total Users</h2>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
          {stats.users}
        </p>
      </div>

      {/* BOOKS */}
      <div className="bg-zinc-800 p-4 sm:p-6 rounded-xl shadow-md hover:scale-[1.02] transition">
        <h2 className="text-sm sm:text-base text-zinc-400">Total Books</h2>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
          {stats.books}
        </p>
      </div>

      {/* ORDERS */}
      <div className="bg-zinc-800 p-4 sm:p-6 rounded-xl shadow-md hover:scale-[1.02] transition">
        <h2 className="text-sm sm:text-base text-zinc-400">Total Orders</h2>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold mt-1">
          {stats.orders}
        </p>
      </div>

    </div>
  )
}

export default DashboardCards