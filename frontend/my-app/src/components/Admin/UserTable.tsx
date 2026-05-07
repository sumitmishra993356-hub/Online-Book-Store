'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import AdminSidebar from '@/components/Admin/AdminSideber'

const UserTable = () => {
  const [users, setUsers] = useState<any[]>([]) // more flexible

 

const fetchUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      "http://localhost:1000/api/v1/get-all-users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          role: "admin", // 🔥 ADD THIS LINE
        },
      }
    );

    setUsers(res.data.users);

  } catch (err: any) {
    console.log(err.response?.data || err.message);
  }
};

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="flex min-h-screen bg-zinc-900 text-white">

      <AdminSidebar />

      <div className="flex-1 p-6">

        <h1 className="text-2xl mb-4 font-bold">Users</h1>

        {users.map((user: any) => (
          <div key={user._id} className="bg-zinc-800 p-3 mb-2 rounded">
            <p>{user.username}</p>
            <p className="text-sm text-zinc-400">{user.email}</p>
            <p className="text-sm text-zinc-400">{user.address}</p>
          </div>
        ))}

      </div>
    </div>
  )
}

export default UserTable