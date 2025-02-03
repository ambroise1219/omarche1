"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User, Search
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'

/**
 * Header du dashboard avec barre de recherche et menu utilisateur
 * @param {Object} props - Propriétés du composant
 * @param {Object} props.user - Informations de l'utilisateur
 * @returns {JSX.Element} Header du dashboard
 */
export default function Header({ user }) {
  const router = useRouter()
  const [showNotifications, setShowNotifications] = useState(false)

  const handleLogout = async () => {
    try {
      // Supprimer le cookie de token
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
      // Rediriger vers la page de connexion
      router.push('/dashboard/auth')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4 gap-4">
        {/* Menu mobile */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Barre de recherche */}
        <div className="flex-1 flex items-center gap-4 lg:gap-8">
          <form className="flex-1 hidden lg:block max-w-xl">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 bg-muted/50"
              />
            </div>
          </form>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            className="relative"
          >
            <Bell className="h-5 w-5" />
            <Badge 
              variant="secondary" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-white"
            >
              3
            </Badge>
          </Button>

          {/* Profil utilisateur */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-custom-orange text-white">
                    {user?.username?.charAt(0)?.toUpperCase() || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center">
                  <span className="text-sm font-medium">{user?.username || 'Admin'}</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
