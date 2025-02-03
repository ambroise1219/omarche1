"use client"

import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet"
import { Button } from "../../ui/button"
import { Menu } from "lucide-react"
import Sidebar from "../Sidebar"

export default function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-72">
        <Sidebar />
      </SheetContent>
    </Sheet>
  )
}
