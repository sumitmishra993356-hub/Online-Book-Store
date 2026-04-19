
'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Book = {
  _id: string;
  title: string;
  author: string;
  price: number;
  url: string;
};

// Helper type for cart with quantity
type CartItem = {
  book: Book;
  quantity: number;
};

const Cart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH CART
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = localStorage.getItem("token");
        if (!user?._id || !token) return;

        const res = await axios.get("http://localhost:1000/api/v1/get-user-cart", {
          headers: {
            id: user._id,
            Authorization: `Bearer ${token}`,
          },
        });

        // Build cart items with quantity
        const countMap: Record<string, CartItem> = {};
        res.data.cart.forEach((book: Book) => {
          if (countMap[book._id]) {
            countMap[book._id].quantity += 1;
          } else {
            countMap[book._id] = { book, quantity: 1 };
          }
        });

        setCartItems(Object.values(countMap));

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // ✅ REMOVE FROM CART
  const handleRemove = async (bookId: string) => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:1000/api/v1/remove-book-from-cart/${bookId}`,
      {},
      {
        headers: {
          id: user._id,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ Remove completely (NOT quantity)
    setCartItems(prev =>
      prev.filter(item => item.book._id !== bookId)
    );

  } catch (err: any) {
    console.log(err.response?.data || err.message);
  }
};

  // ✅ PLACE ORDER
const handlePlaceOrder = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("token");

    if (!user?._id || !token) {
      alert("Please login first");
      return;
    }

    // 🔥 Convert cartItems → order format
    const orderItems = cartItems.map((item) => ({
      bookId: item.book._id,
      quantity: item.quantity,
    }));

    const res = await axios.post(
      "http://localhost:1000/api/v1/place-order",
      {
        order: orderItems, // ✅ matches your backend
      },
      {
        headers: {
          id: user._id, // ✅ your flow
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Order placed successfully 🎉");

    // ✅ Clear cart UI after order
    setCartItems([]);

  } catch (err: any) {
    console.log(err.response?.data || err.message);
  }
};


  // ✅ TOTAL PRICE
  const total = cartItems.reduce((acc, item) => acc + item.book.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-white">
        Loading Cart...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white px-4 md:px-10 py-8">
      <h1 className="text-3xl font-bold mb-6">🛒 My Cart</h1>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] bg-zinc-800 rounded-xl">
          <p className="text-2xl mb-3">🛒</p>
          <p className="text-zinc-400">Your cart is empty</p>
          <Link
            href="/books"
            className="mt-4 px-5 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-400"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT: ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={`${item.book._id}-${index}`} // unique key
                className="flex gap-4 bg-zinc-800 p-4 rounded-lg"
              >
                <img
                  src={item.book.url}
                  className="h-24 w-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.book.title}</h2>
                  <p className="text-zinc-400 text-sm">{item.book.author}</p>
                  <p className="text-yellow-400 mt-2">
                    ₹ {item.book.price} x {item.quantity} = ₹ {item.book.price * item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.book._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="bg-zinc-800 p-6 rounded-xl h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="flex justify-between text-zinc-400 mb-2">
              <span>Items</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>Total</span>
              <span>₹ {total}</span>
            </div>
            <button  onClick={handlePlaceOrder}
            className="w-full bg-yellow-500 text-black py-2 rounded hover:bg-yellow-400">
              Checkout
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default Cart;