import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import TopBar from '../components/layout/TopBar'

export default function AppShell() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex max-w-7xl gap-4 px-3 py-4 sm:px-6">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
        <main className="min-w-0 flex-1">
          <TopBar onMenuClick={() => setMobileSidebarOpen((prev) => !prev)} />
          <div className="mt-4">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}