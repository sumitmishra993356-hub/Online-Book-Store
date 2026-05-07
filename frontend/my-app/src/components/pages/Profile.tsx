
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import BookCart from '../BookCard/BookCard'
import Link from 'next/link'
import Loader from '../Loader/Loader'


const Profile = () => {

  const { logout } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState('profile')
  const [user, setUser] = useState<any>(null)

  const [favourites, setFavourites] = useState([]);
  const [loadingFav, setLoadingFav] = useState(true);

  const [loadingUser, setLoadingUser] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    avatar: "",
    address: ""
  });

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);



  const getStep = (status: string) => {
    if (status === "cancelled") return 0;
    if (status === "order placed") return 1;
    if (status === "out for delivery") return 2;
    if (status === "Delivered") return 3;
    return 1; // ✅ fallback
  };

  const [selectedOrder, setSelectedOrder] = useState<any>(null)


  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        avatar: user.avatar || "",
        address: user.address || ""
      });
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push('/login')
    }
  }, [])

  // ✅ OUTSIDE useEffect (global inside component)
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await axios.get(
        "http://localhost:1000/api/v1/get-order-history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: user._id,
          },
        }
      );

      setOrders(res.data.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("token");

        if (!user?._id || !token) return;

        const res = await axios.get(
          "http://localhost:1000/api/v1/get-all-favourite-books",
          {
            headers: {
              id: user._id,
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFavourites(res.data.favourites);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingFav(false);
      }
    };

    fetchFavourites();
  }, []);

  const handleLogout = () => {
    logout()
    localStorage.removeItem('id')
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }


  const handleCancelOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:1000/api/v1/cancel-order",
        {
          orderId: orderId, // ✅ send in body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            orderId: orderId,
          },
        }
      );

      alert(res.data.message);

      // 🔥 update UI instantly
      setOrders((prev: any) =>
        prev.map((o: any) =>
          o._id === orderId ? { ...o, status: "cancelled" } : o
        )
      );

    } catch (err: any) {
      console.log(err.response?.data || err.message);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.put(
        "http://localhost:1000/api/v1/update-user",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: user._id, // ✅ IMPORTANT
          },
        }
      );
      console.log(res.data); // 🔥 ADD THIS
      setUser(res.data.user); // ✅ instant UI update
      setIsEditOpen(false);

      alert("Profile updated successfully");

    } catch (err) {
      console.log(err);
    }
  };

  const handleReturn = async (orderId: string) => {
    const confirmReturn = confirm("Do you want to return this order?");
    if (!confirmReturn) return;

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        "http://localhost:1000/api/v1/return-order",
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Return requested successfully");
      fetchOrders();

    } catch (err: any) {
      alert(err?.response?.data?.message || "Error");
    }
  };

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token')
      // const id = localStorage.getItem('id')
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const id = user._id;

      const res = await axios.get(
        'http://localhost:1000/api/v1/get-user-information',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            id: id,
            // id: user._id, // ✅ FIXED
          }
        }
      )

      setUser(res.data.user)
    } catch (err) {
      console.log(err)
    }
    finally {
      setLoadingUser(false); // ✅ IMPORTANT
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const handleRemoveFavourite = async (bookId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = localStorage.getItem("token");

      if (!user?._id || !token) {
        alert("Please login first");
        return;
      }

      const res = await axios.put(
        "http://localhost:1000/api/v1/remove-book-from-favourite",
        {},
        {
          headers: {
            bookid: bookId,
            id: user._id,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ REMOVE FROM UI (IMPORTANT)
      setFavourites((prev: any) =>
        prev.filter((book: any) => book._id !== bookId)
      );

      alert(res.data.message);

    } catch (err: any) {
      console.log(err.response?.data || err.message);
    }
  };

  return (


    <div className="min-h-screen bg-zinc-900 text-white flex flex-col md:flex-row">

      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-zinc-800 p-4 flex md:flex-col items-center md:items-start overflow-x-auto scrollbar-hide gap-2">

        <h2 className="text-2xl font-bold mb-2 text-center hidden md:block">
          Dashboard
        </h2>

        {["profile", "favourites", "orders", "settings"].map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`w-auto md:w-full text-center md:text-left px-3 md:px-4 py-2 rounded min-w-30
        ${activeTab === item
                ? "bg-yellow-500 text-black"
                : "hover:bg-zinc-700"
              }`}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}

        <button
          onClick={handleLogout}
          className="w-auto md:w-full bg-red-500 px-4 py-2 rounded md:mt-6 min-w-30"
        >
          Logout
        </button>

      </div>

      {/* Content */}
      <div className="flex-1 p-6">


        {/* PROFILE */}

        {activeTab === 'profile' && (
          <div className="max-w-4xl mx-auto">

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
              My Profile
            </h1>

            <div className="bg-zinc-800 rounded-xl shadow-lg p-6 flex flex-col md:flex-row items-center md:items-start gap-6">

              {/* 🟡 Skeleton */}
              {loadingUser ? (
                <>
                  {/* Avatar Skeleton */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-zinc-700 animate-pulse"></div>

                  {/* Text Skeleton */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="h-5 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
                    <div className="h-5 bg-zinc-700 rounded w-2/3 animate-pulse"></div>
                    <div className="h-5 bg-zinc-700 rounded w-1/3 animate-pulse"></div>
                  </div>
                </>
              ) : (
                <>
                  {/* ✅ Actual Data */}
                  <div className="shrink-0">
                    <img
                      src={user?.avatar || "/default-avatar.png"}
                      alt="profile"
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-2 border-yellow-500"
                    />
                  </div>

                  <div className="flex-1 w-full text-center md:text-left space-y-3">

                    <p className="text-lg">
                      <span className="text-zinc-400">Name:</span>{" "}
                      <span className="font-semibold">{user?.username}</span>
                    </p>

                    <p className="text-lg">
                      <span className="text-zinc-400">Email:</span>{" "}
                      <span className="font-semibold">{user?.email}</span>
                    </p>

                    <p className="text-lg">
                      <span className="text-zinc-400">Address:</span>{" "}
                      <span className="font-semibold">
                        {user?.address || "Not added"}
                      </span>
                    </p>

                  </div>
                </>
              )}

            </div>
          </div>
        )}


        {activeTab === 'favourites' && (
          <div className="w-full">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                ❤️ My Favourites
              </h1>
              <p className="text-zinc-400 text-sm">
                {favourites.length} books
              </p>
            </div>

            {/* EMPTY STATE */}
            {favourites.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[40vh] md:h-[50vh] text-center bg-zinc-800 rounded-xl border border-zinc-700">

                <div className="text-5xl mb-4">💔</div>

                <h2 className="text-xl text-white font-semibold">
                  No favourites yet
                </h2>

                <p className="text-zinc-400 mt-2">
                  Start adding books you love ❤️
                </p>

                <Link
                  href="/books"
                  className="mt-4 px-5 py-2 bg-yellow-500 text-black rounded-lg font-medium hover:bg-yellow-400 transition"
                >
                  Browse Books
                </Link>
              </div>
            )}

            {/* GRID */}
            {favourites.length > 0 && (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >

                {favourites.map((book: any) => (
                  <Link
                    href={`/book/${book._id}`}
                    key={book._id}
                    className="group bg-zinc-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition duration-300"
                  >

                    {/* IMAGE */}
                    <div className="overflow-hidden">
                      <img
                        src={book.url}
                        alt={book.title}
                        className="h-52 w-full object-cover group-hover:scale-105 transition duration-300 "
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-4">

                      <h3 className="text-white font-semibold text-lg line-clamp-1">
                        {book.title}
                      </h3>

                      <p className="text-zinc-400 text-sm mt-1">
                        {book.author}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <p className="text-yellow-200 font-bold text-lg">
                          ₹ {book.price}
                        </p>

                        {/* ❤️ ICON */}
                        <button
                          onClick={(e) => {
                            e.preventDefault(); // 🔥 prevent Link click
                            handleRemoveFavourite(book._id);
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
                        >
                          ✖
                        </button>
                      </div>
                    </div>

                  </Link>


                ))}

              </div>
            )}

          </div>
        )}

        {/* ORDERS */}

        {activeTab === 'orders' && (
          <div className="w-full">
            {selectedOrder && (
              <div
                className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                onClick={() => setSelectedOrder(null)}
              >
                <div
                  className="bg-zinc-900 w-[95%] max-w-lg p-6 rounded-xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="absolute top-2 right-3 text-white"
                  >
                    ✖
                  </button>

                  <h2 className="text-xl font-bold mb-4">📦 Order Details</h2>

                  {/* ORDER INFO */}
                  <div className="mb-4">
                    <p><b>Order ID:</b> {selectedOrder._id}</p>
                    <p><b>Status:</b> {selectedOrder.status}</p>
                    <p>
                      <b>Date:</b>{" "}
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </p>
                  </div>

                  {/* BOOK */}
                  <div className="mb-4 border-t border-zinc-700 pt-3">
                    <p className="font-semibold mb-2">Book</p>
                    <div className="flex gap-3">
                      <img
                        src={selectedOrder.book?.url}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div>
                        <p>{selectedOrder.book?.title}</p>
                        <p className="text-sm text-zinc-400">
                          {selectedOrder.book?.author}
                        </p>
                        <p className="text-sm">₹{selectedOrder.book?.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* USER */}
                  <div className="border-t border-zinc-700 pt-3">
                    <p className="font-semibold mb-2">Delivery Info</p>
                    <p>{selectedOrder.user?.username || "N/A"}</p>
                    <p className="text-sm text-zinc-400">
                      {selectedOrder.user?.email || "N/A"}
                    </p>
                    <p className="text-sm">
                      {selectedOrder.user?.address || "No address"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                📦 My Orders
              </h1>
              <p className="text-zinc-400 text-sm">
                {orders.length} orders
              </p>
            </div>

            {/* LOADING */}
            {loadingOrders ? (
              <Loader />
            ) : orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[40vh] md:h-[50vh] bg-zinc-800 rounded-xl border border-zinc-700">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-zinc-400 text-center">
                  You haven't placed any orders yet.
                </p>
              </div>
            ) : (

              <div className="space-y-6">

                {orders.map((order: any) => {

                  const step = getStep(order.status) ?? 0;

                  return (


                    <div
                      key={order._id}
                      className="bg-zinc-800 p-4 md:p-5 rounded-xl border border-zinc-700"
                    >

                      {/* ORDER INFO */}
                      <div className="flex justify-between mb-4">
                        <div>
                          <p className="text-sm text-zinc-400">
                            Order ID: {order._id.slice(0, 8)}...
                          </p>
                          <p className="text-xs text-zinc-500">
                            {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>

                        {/* RIGHT SIDE */}
                        <div className="flex flex-col items-center gap-2">
                          <span
                            className={`px-3 py-2 rounded text-sm font-medium ${order.status === "Delivered"
                              ? "bg-green-500"
                              : order.status === "cancelled"
                                ? "bg-red-500"
                                : order.status === "out for delivery"
                                  ? "bg-blue-500"
                                  : "bg-yellow-500"
                              }`}
                          >
                            {order.status}
                          </span>


                        </div>

                      </div>

                      {/* BOOK */}
                      {order.book && (
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-zinc-900 p-4 rounded">
                          <img
                            src={order.book.url}
                            className="w-14 h-18 sm:w-16 sm:h-20 object-cover rounded"
                          />
                          <div>
                            <p className="text-white font-semibold">
                              {order.book.title}
                            </p>
                            <p className="text-zinc-400 text-sm">
                              {order.book.author}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* 🔥 TIMELINE */}
                      {/* <div className="mt-5"> */}

                      {/* 🔥 TIMELINE OR CANCELLED */}
                      {order.status === "cancelled" ? (
                        <div className="mt-5 text-red-500 font-semibold text-sm">
                          ❌ This order has been cancelled
                        </div>
                      ) : (
                        <div className="mt-5">
                        </div>
                      )}

                      <div className="flex items-center justify-between relative px-2 md:px-0">

                        {/* BASE LINE */}
                        <div className="absolute top-3 left-0 w-full h-1 bg-zinc-700 rounded"></div>

                        {/* ACTIVE LINE */}
                        <div
                          className="absolute top-3 left-0 h-1 bg-yellow-300 rounded"
                          style={{
                            width:
                              step === 0
                                ? "0%"
                                : step === 1
                                  ? "10%"
                                  : step === 2
                                    ? "50%"
                                    : "100%",
                          }}
                        ></div>

                        {/* STEP 1 */}
                        <div className="flex flex-col items-center z-10">
                          <div className={`w-6 h-6 rounded-full ${step >= 1 ? "bg-yellow-500" : "bg-zinc-600"}`}></div>
                          <p className="text-xs mt-2 text-zinc-400">Placed</p>
                        </div>

                        {/* STEP 2 */}
                        <div className="flex flex-col items-center z-10">
                          <div className={`w-6 h-6 rounded-full ${step >= 2 ? "bg-yellow-500" : "bg-zinc-600"}`}></div>
                          <p className="text-xs mt-2 text-zinc-400">Shipping</p>
                        </div>

                        {/* STEP 3 */}
                        <div className="flex flex-col items-center z-10">
                          <div className={`w-6 h-6 rounded-full ${step >= 3 ? "bg-green-500" : "bg-zinc-600"}`}></div>
                          <p className="text-xs mt-2 text-zinc-400">Delivered</p>
                        </div>

                      </div>


                      {/*  View Details & Cancel/Return Buttons */}
                      {/* <div className="mt-4 flex justify-between items-center"> */}
                      <div className="mt-4 flex flex-col sm:flex-row justify-between gap-3 sm:items-center">

                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-400 text-sm hover:underline"
                        >
                          View Details
                        </button>

                        {/* 🔥 CANCEL BUTTON */}
                        {order.status !== "Delivered" && order.status !== "cancelled" && (
                          <button
                            onClick={() => {
                              const confirmCancel = confirm("Are you sure you want to cancel this order?");
                              if (confirmCancel) handleCancelOrder(order._id);
                            }}
                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white text-sm"
                          >
                            Cancel Order
                          </button>
                        )}
                        {/* 🔥 RETURN BUTTON */}
                        {order.status === "Delivered" && order.returnStatus === "none" && (
                          <button
                            onClick={() => handleReturn(order._id)}
                            className=" px-4 py-2 rounded text-white text-sm"
                            style={{ backgroundColor: "#f97316", borderColor: "#f97316"}} 
                          >
                            Return Order
                          </button>
                        )}

                        {/* 🔁 REQUESTED */}
                        {order.returnStatus === "requested" && (
                          <span className="bg-orange-500 px-3 py-1 text-xs rounded"
                          style={{ backgroundColor: "#f97316", borderColor: "#f97316"}}
                          >
                            Return Requested
                          </span>
                        )}

                        {/* ✅ APPROVED */}
                        {order.returnStatus === "approved" && (
                          <span className="bg-green-500 px-3 py-1 text-xs rounded">
                            Return Approved
                          </span>
                        )}

                        {/* ❌ REJECTED */}
                        {order.returnStatus === "rejected" && (
                          <span className="bg-red-500 px-3 py-1 text-xs rounded">
                            Return Rejected
                          </span>
                        )}

                      </div>

                    </div>
                  );
                })
                }

              </div>
            )}
          </div>
        )}

        {/* SETTINGS */}
        {activeTab === 'settings' && (

          <div>
            <div>
              <button
                onClick={() => setIsEditOpen(true)}
                className="bg-yellow-500 hover:bg-yellow-400 px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            </div>
            <div>
              {isEditOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                  <div className="bg-zinc-900 p-6 rounded-xl w-[90%] md:w-96">

                    <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      className="w-full mb-3 p-2 bg-zinc-800 rounded"
                    />

                    <input
                      type="text"
                      placeholder="Avatar URL"
                      value={formData.avatar}
                      onChange={(e) =>
                        setFormData({ ...formData, avatar: e.target.value })
                      }
                      className="w-full mb-3 p-2 bg-zinc-800 rounded"
                    />

                    <input
                      type="text"
                      placeholder="Address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full mb-4 p-2 bg-zinc-800 rounded"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsEditOpen(false)}
                        className="px-4 py-2 bg-gray-600 rounded"
                      >
                        Cancel
                      </button>

                      <button
                        onClick={handleUpdateProfile}
                        className="px-4 py-2 bg-yellow-500 text-black rounded"
                      >
                        Save
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </div>
          </div>

        )}

      </div>
    </div>
  )
}

export default Profile