'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminSidebar from '@/components/Admin/AdminSideber'

const OrderTable = () => {
  const [orders, setOrders] = useState([])
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [filter, setFilter] = useState("all")

  const statusFlow = [
    "order placed",
    "out for delivery",
    "Delivered"
  ];
  const statusColor: any = {
    "order placed": "bg-yellow-500",
    "out for delivery": "bg-blue-500",
    "Delivered": "bg-green-500",
    "cancelled": "bg-red-500",
  };


  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter(
        (o: any) => o.status?.toLowerCase() === filter.toLowerCase()
      )

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await axios.get(
        "http://localhost:1000/api/v1/get-all-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            role: user.role, // 🔥 IMPORTANT
          },
        }
      );

      // ✅ Fix response key
      setOrders(res.data.orders || res.data.data || []);

    } catch (err: any) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchOrders()
  }, [])

  // const updateStatus = async (id: string, status: string) => {
  //   await axios.put("http://localhost:1000/api/v1/update-order-status", {
  //     orderId: id,
  //     status
  //   })
  //   fetchOrders()
  // }

  const updateStatus = async (id: string, status: string) => {
    if (!confirm(`Change status to ${status}?`)) return;
    try {
      const token = localStorage.getItem("token")

      await axios.put(
        `http://localhost:1000/api/v1/update-order-status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      fetchOrders()
    } catch (err: any) {
      console.log("UPDATE ERROR:", err?.response?.data || err.message)
    }
  }

  return (

    // ✅ Container */}
    <div className="flex min-h-screen bg-zinc-900 text-white">

      {/* // ✅ User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}   // 👈 REQUIRED
        >

          {/* Modal Box */}
          <div className="bg-zinc-900 p-6 rounded-xl w-[90%] max-w-md relative scale-95 animate-in"
            onClick={(e) => e.stopPropagation()}  // 👈 THIS WORKS NOW
          >

            {/* Close Button */}
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-2 right-3 text-white text-lg"
            >
              ✖
            </button>

            {/* User Info */}
            <div className="flex flex-col items-center text-center">

              <img
                src={selectedUser?.avatar}
                className="w-20 h-20 rounded-full mb-3 object-cover"
              />

              <h2 className="text-xl font-bold">{selectedUser?.username}</h2>

              <p className="text-zinc-400">{selectedUser?.email}</p>

              <p className="mt-2 text-sm">
                <b>Address:</b> {selectedUser?.address || "N/A"}
              </p>

              <p className="mt-1 text-sm">
                <b>Role:</b> {selectedUser?.role}
              </p>

            </div>

          </div>
        </div>
      )}
      <AdminSidebar />


      {/* ✅ Main Content  */}
      <div className="flex-1 p-6">
        {/* // ✅ Heading */}
        <h1 className="text-2xl mb-4 font-bold">Orders</h1>

        {/* // ✅ Filter Buttons  */}
        <div className="flex flex-wrap gap-3 mb-4">

          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-white text-black" : "bg-zinc-700"}`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("order placed")}
            className={`px-3 py-1 rounded ${filter === "order placed" ? "bg-yellow-500 text-black" : "bg-zinc-700"}`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("out for delivery")}
            className={`px-3 py-1 rounded ${filter === "out for delivery" ? "bg-blue-500 text-black" : "bg-zinc-700"}`}
          >
            Shipping
          </button>

          <button
            onClick={() => setFilter("Delivered")}
            className={`px-3 py-1 rounded ${filter === "Delivered" ? "bg-green-500 text-black" : "bg-zinc-700"}`}
          >
            Delivered
          </button>

          <button
            onClick={() => setFilter("cancelled")}
            className={`px-3 py-1 rounded ${filter === "cancelled" ? "bg-red-500 text-black" : "bg-zinc-700"}`}
          >
            Cancelled
          </button>

        </div>

        {/* // ✅ Orders List */}
        {/* {orders.map((order: any) => ( */}
        {filteredOrders.map((order: any) => (
          <div key={order._id} className="bg-zinc-800 p-4 mb-3 rounded">

            {/* <p>{order.book?.title}</p> */}
            <p>Book: {order.book?.title || "N/A"}</p>
            <p>Price: ₹{order.book?.price || "N/A"}</p>
            {/* <p>User: {order.user?.username || "Unknown"}</p> */}
            <p
              className="cursor-pointer text-blue-400 hover:underline"
              onClick={() => setSelectedUser(order.user)}
            >
              User: {order.user?.username}
            </p>
            <p className="text-sm text-zinc-400">
              {new Date(order.createdAt).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short'
              })}
            </p>


            {/* // ✅ Color-coded status */}
            <select
              value={order.status}
              onChange={(e) => updateStatus(order._id, e.target.value)}
              className={`mt-3 px-3 py-1 rounded text-white font-semibold w-auto  ${statusColor[order.status] || "bg-zinc-700"}`}

            >
              {["order placed", "out for delivery", "Delivered", "cancelled"].map((status) => {
                const currentIndex = statusFlow.indexOf(order.status)
                const nextIndex = statusFlow.indexOf(status)

                const isDisabled =
                  order.status === "cancelled" ||
                  order.status === "Delivered" ||
                  (nextIndex !== -1 && nextIndex < currentIndex)

                return (
                  <option key={status} value={status} disabled={isDisabled} className='bg-zinc-700 text-white'>
                    {status}
                  </option>
                )
              })}
            </select>
          </div>
        ))}

      </div>
    </div>
  )
}

export default OrderTable