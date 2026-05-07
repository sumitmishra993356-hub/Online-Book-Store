

'use client'

import DashboardCards from '@/components/Admin/DashboardCards'
import AdminSidebar from '@/components/Admin/AdminSideber'

const AdminPage = () => {
  return (
    <div className="flex bg-zinc-900 text-white min-h-screen">
      <AdminSidebar />

      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <DashboardCards />
      </div>
    </div>
  )
}

export default AdminPage
