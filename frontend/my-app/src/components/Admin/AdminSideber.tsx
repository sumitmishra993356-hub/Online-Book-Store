'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const AdminSidebar = () => {
  const path = usePathname()
  const router = useRouter()

  const links = [
    { name: "Dashboard", href: "/admin" },
    { name: "Books", href: "/admin/books" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Users", href: "/admin/users" },
  ]

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return

    localStorage.removeItem("token")
    localStorage.removeItem("user")

    window.location.href = "/login"   // 🔥 hard reload
    // router.push("/login")
  }

  return (
    <div className="w-full md:w-64 bg-zinc-900 p-4 flex flex-col md:h-screen justify-between">

      {/* 🔹 Top Links */}
      <div className="flex md:flex-col gap-3 overflow-x-auto">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`px-4 py-2 rounded whitespace-nowrap ${path === link.href
              ? "bg-yellow-500 text-black"
              : "text-white hover:bg-zinc-800"
              }`}
          >
            {link.name}
          </Link>
        ))}

        {/* 🔻 Logout Button */}
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white mt-4 w-full"
        >
          Logout
        </button>
      </div>



    </div>
  )
}

export default AdminSidebar