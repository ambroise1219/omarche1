"use client"

import { cn } from "../../lib/utils"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { useDashboard } from "../../contexts/DashboardContext"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut,
  Truck,
  BarChart3,
  Store,
  MessageSquare,
  Bell,
  BaggageClaim
} from "lucide-react"

/**
 * Sidebar améliorée avec un design moderne
 * @returns {JSX.Element} Barre latérale de navigation
 */
export default function Sidebar() {
  const { activeSection, setActiveSection } = useDashboard()

  const mainNavItems = [
    {
      title: "Vue d'ensemble",
      id: "overview",
      icon: LayoutDashboard,
      variant: "default"
    },
    {
      title: "Commandes",
      id: "orders",
      icon: ShoppingCart,
      variant: "ghost",
      badge: "12"
    },
    {
      title: "Produits",
      id: "products",
      icon: Package,
      variant: "ghost"
    },
    {
      title: "Catégories",
      id: "categories",
      icon: BaggageClaim,
      variant: "ghost"
    },
    {
      title: "Clients",
      id: "customers",
      icon: Users,
      variant: "ghost"
    },
    {
      title: "Livraisons",
      id: "deliveries",
      icon: Truck,
      variant: "ghost",
      badge: "5"
    },
    
  ]

  const secondaryNavItems = [
    {
      title: "Messages",
      id: "messages",
      icon: MessageSquare,
      variant: "ghost",
      badge: "3"
    },
    {
      title: "Notifications",
      id: "notifications",
      icon: Bell,
      variant: "ghost",
      badge: "8"
    }
  ]

  const bottomNavItems = [
    {
      title: "Paramètres",
      id: "settings",
      icon: Settings,
      variant: "ghost"
    }
  ]

  return (
    <div className="flex flex-col h-full">
      {/* En-tête de la Sidebar - fixe */}
      <div className="flex h-16 items-center border-b px-4 sticky top-0 bg-background z-10">
        <button 
          onClick={() => setActiveSection("overview")}
          className="flex items-center gap-2 font-bold text-xl"
        >
          <div className="p-1 bg-orange-100 rounded-lg">
            <Store className="h-6 w-6 text-orange-600" />
          </div>
          <span className="bg-gradient-to-r from-orange-600 to-green-600 text-transparent bg-clip-text">
            O&apos;Marché
          </span>
        </button>
      </div>

      {/* Zone de navigation principale - défilante */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-6">
          {/* Navigation principale */}
          <nav className="space-y-2">
            {mainNavItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className={cn(
                  "relative w-full justify-start gap-2 hover:bg-amber-500/30 p-2 transition-all duration-200",
                  activeSection === item.id && "bg-amber-500/30 p-2 text-white hover:bg-accent/60 font-medium"
                )}
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className={cn(
                  "h-4 w-4 transition-colors",
                  activeSection === item.id ? "text-orange-600" : "text-muted-foreground"
                )} />
                <span className={cn(
                  activeSection === item.id ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.title}
                </span>
                {item.badge && (
                  <span className="absolute right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[11px] text-white font-medium">
                    {item.badge}
                  </span>
                )}
              </Button>
            ))}
          </nav>

          {/* Navigation secondaire */}
          <div>
            <h4 className="px-2 text-xs font-semibold uppercase text-muted-foreground mb-2">
              Communications
            </h4>
            <nav className="space-y-2">
              {secondaryNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "secondary" : "ghost"}
                  className={cn(
                    "relative w-full justify-start gap-2 hover:bg-amber-500/30 p-2 transition-all duration-200",
                    activeSection === item.id && "bg-amber-500/30 p-2 text-white hover:bg-accent/60 font-medium"
                  )}
                  onClick={() => setActiveSection(item.id)}
                >
                  <item.icon className={cn(
                    "h-4 w-4 transition-colors",
                    activeSection === item.id ? "text-orange-600" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    activeSection === item.id ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {item.title}
                  </span>
                  {item.badge && (
                    <span className="absolute right-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[11px] text-white font-medium">
                      {item.badge}
                    </span>
                  )}
                </Button>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>

      {/* Navigation du bas - fixe */}
      <div className="border-t p-4 bg-background">
        <nav className="space-y-2">
          {bottomNavItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2 hover:bg-amber-500/30 p-2 transition-all duration-200",
                activeSection === item.id && "bg-amber-500/30 p-2 text-white hover:bg-accent/60"
              )}
              onClick={() => setActiveSection(item.id)}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Button>
          ))}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => {
              // Gérer la déconnexion ici
              console.log("Déconnexion")
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        </nav>
      </div>
    </div>
  )
}
