"use client"

import { useState } from "react"
import { DashboardProvider } from "../../contexts/DashboardContext"
import Sidebar from "../../components/dashboard/Sidebar"
import Header from "../../components/dashboard/Header"
import DashboardContent from "../../components/dashboard/DashboardContent"
import { Sheet, SheetContent } from "../../components/ui/sheet"

/**
 * Page principale du tableau de bord
 * @returns {JSX.Element} Interface complète du tableau de bord
 */
export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-background">
        <div className="flex">
          {/* Sidebar pour desktop */}
          <aside className="hidden lg:block w-72 min-h-screen border-r">
            <Sidebar />
          </aside>

          {/* Sidebar mobile */}
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetContent side="left" className="p-0 w-72">
              <Sidebar />
            </SheetContent>
          </Sheet>

          {/* Contenu principal */}
          <main className="flex-1">
            <Header onMenuClick={() => setSidebarOpen(true)} />
            <div className="p-6">
              <DashboardContent />
            </div>
          </main>
        </div>
      </div>
    </DashboardProvider>
  )
}
