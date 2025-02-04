'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useRouter } from 'next/navigation'
import { Navigation } from '../../components/landing/Navigation'
import { Footer } from '../../components/landing/Footer'
import { LoadingSpinner } from '../../components/ui/loading-spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Tabs, TabsContent, TabsList,  } from '../../components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { Separator } from '../../components/ui/separator'
import { MapPin, Package, User, Heart, ShoppingBag, Bell, Shield, CreditCard, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Input } from '../../components/ui/input'
import { Label } from "@/components/ui/label"
import { Textarea } from '../../components/ui/textarea'
import { UploadButton } from "../../utils/uploadthing"
import { toast } from 'sonner'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/**
 * Page de profil utilisateur
 * Permet de visualiser et modifier les informations de l'utilisateur
 */
export default function ProfilePage() {
  // État global de l'authentification
  const { user, loading, logout, checkAuth } = useAuth()
  const router = useRouter()
  
  // États locaux
  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  
  // État du formulaire avec les données utilisateur
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phone_number: '',
    location: '',
    profile_image_url: ''
  })

  /**
   * Statistiques affichées sur le profil utilisateur
   */
  const statItems = [
    { icon: ShoppingBag, label: 'Commandes', value: '0', color: 'text-orange-500' },
    { icon: Heart, label: 'Favoris', value: '0', color: 'text-green-500' },
    { icon: CreditCard, label: 'Points', value: '100', color: 'text-orange-500' }
  ]

  /**
   * Historique des activités de l'utilisateur
   */
  const activityItems = [
    { icon: User, label: 'Profil créé', date: 'Janvier 2024', color: 'bg-orange-500' },
    { icon: Shield, label: 'Vérification email', date: 'Janvier 2024', color: 'bg-green-500' }
  ]

  // Liste des communes d'Abidjan
  const communes = [
    "Abobo",
    "Adjamé",
    "Attécoubé",
    "Cocody",
    "Koumassi",
    "Marcory",
    "Plateau",
    "Port-Bouët",
    "Treichville",
    "Yopougon",
  ]

  // Vérification de l'authentification et redirection si nécessaire
  useEffect(() => {
    const checkAuth = async () => {
      console.log('Profile - État de l\'authentification:', { user, loading })
      
      if (!loading && !user) {
        console.log('Profile - Redirection vers /auth')
        router.push('/auth?redirectTo=/profile')
        return
      }

      // Mise à jour du formulaire quand l'utilisateur est chargé
      if (user) {
        setFormData({
          username: user.username || '',
          email: user.email || '',
          password: '',
          phone_number: user.phone_number || '',
          location: user.location || '',
          profile_image_url: user.profile_image_url || ''
        })

        // Mise à jour de la progression du profil
        const fields = ['username', 'email', 'phone_number', 'location', 'profile_image_url']
        const filledFields = fields.filter(field => user[field]).length
        const progress = Math.round((filledFields / fields.length) * 100)
        setProgress(progress)
      }
    }

    checkAuth()
  }, [user, loading, router])

  // Animation de la barre de progression
  useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    return () => clearTimeout(timer)
  }, [])

  // Gestion des changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Soumission du formulaire de mise à jour
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour")
      }

      toast.success("Profil mis à jour avec succès")
      setIsEditing(false)
      
      // Mettre à jour l'état global de l'utilisateur
      await checkAuth()
    } catch (error) {
      console.error("Erreur:", error)
      toast.error(error.message)
    }
  }

  // Affichage du spinner pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  // Affichage de la page de profil si l'utilisateur est connecté
  if (!user) {
    return null
  }

  // Variants d'animation pour les éléments de la page
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <motion.div 
        className="container mx-auto px-4 py-28"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar avec informations de profil */}
          <motion.div className="w-full md:w-1/3 space-y-6" variants={itemVariants}>
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="text-center relative pb-0">
                <div className="absolute top-4 right-4">
                  
                </div>
                <div className="flex justify-center mb-4">
                  <Avatar className="w-32 h-32 border-4 border-primary/10">
                    <AvatarImage src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.username}`} />
                    <AvatarFallback className="text-2xl">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl font-bold">{user.username}</CardTitle>
                <CardDescription className="text-primary/80">{user.email}</CardDescription>
                <div className="mt-2 flex justify-center gap-2">
                  <Badge variant="secondary" className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 transition-colors">
                    {user.role}
                  </Badge>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors">
                    Nouveau membre
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground mb-2">Progression du profil</div>
                  <Progress value={progress} className="h-2 bg-orange-100">
                    <div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
                  </Progress>
                  <p className="text-xs text-muted-foreground text-right">{progress}% Terminé</p>
                </div>
                <Separator className="my-6" />
                <nav className="space-y-2">
                  <Button 
                    variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                    className={`w-full justify-between group ${activeTab === 'overview' ? 'bg-orange-500 text-white hover:bg-orange-600' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    <span className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Vue d'ensemble
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button 
                    variant={activeTab === 'orders' ? 'default' : 'ghost'} 
                    className={`w-full justify-between group ${activeTab === 'orders' ? 'bg-green-500 text-white hover:bg-green-600' : ''}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <span className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      Mes commandes
                    </span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                 
                </nav>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={async () => {
                    await logout()
                    router.push('/auth')
                    toast.success('Déconnexion réussie')
                  }}
                >
                  Se déconnecter
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Contenu principal */}
          <motion.div className="w-full md:w-2/3" variants={itemVariants}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              

              <TabsContent value="overview">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Informations personnelles</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-orange-500 hover:text-orange-600"
                      >
                        {isEditing ? 'Annuler' : 'Modifier'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="username">Nom d'utilisateur</Label>
                          <Input
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Votre nom d'utilisateur"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Votre email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="password">Nouveau mot de passe</Label>
                          <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="Laissez vide pour ne pas changer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone_number">Numéro de téléphone</Label>
                          <Input
                            id="phone_number"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleInputChange}
                            placeholder="Votre numéro de téléphone"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Commune</Label>
                          <Select
                            value={formData.location}
                            onValueChange={(value) =>
                              setFormData(prev => ({ ...prev, location: value }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez votre commune" />
                            </SelectTrigger>
                            <SelectContent>
                              {communes.map((commune) => (
                                <SelectItem key={commune} value={commune}>
                                  {commune}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="profile_image">Photo de profil</Label>
                          <div className="flex items-center gap-4">
                            {/* Aperçu de la photo actuelle */}
                            <div className="w-24 h-24 border-2 border-dashed rounded-lg border-muted-foreground/25">
                              {formData.profile_image_url ? (
                                <img 
                                  src={formData.profile_image_url} 
                                  alt="Photo de profil" 
                                  className="w-full h-full rounded-lg object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User className="w-8 h-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                            {/* Bouton d'upload avec uploadthing */}
                            <div className="flex-1">
                              <UploadButton
                                endpoint="profileImage"
                                appearance={{
                                  button: "bg-orange-500 p-2 hover:bg-orange-600",
                                  container: "w-full"
                                }}
                                content={{
                                  button({ ready }) {
                                    if (!ready) return 'Chargement...'
                                    return formData.profile_image_url 
                                      ? 'Changer la photo'
                                      : 'Ajouter une photo'
                                  }
                                }}
                                onClientUploadComplete={(res) => {
                                  if (res?.[0]?.url) {
                                    setFormData(prev => ({
                                      ...prev,
                                      profile_image_url: res[0].url
                                    }))
                                    toast.success("Image téléchargée avec succès")
                                  }
                                }}
                                onUploadError={(error) => {
                                  toast.error(`Erreur: ${error.message}`)
                                }}
                                onUploadBegin={() => {
                                  toast.info("Téléchargement en cours...")
                                }}
                              />
                              <p className="text-sm text-muted-foreground mt-2">
                                Format recommandé : JPG, PNG. Taille maximale : 4MB
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                          >
                            Enregistrer
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-orange-500/10">
                            <User className="h-6 w-6 text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Nom d'utilisateur</p>
                            <p className="text-sm text-muted-foreground">
                              {user.username}
                            </p>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-green-500/10">
                            <MapPin className="h-6 w-6 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Commune</p>
                            <p className="text-sm text-muted-foreground">{user.location}</p>
                          </div>
                          
                        </div>
                        <Separator />
                        <div className="flex items-center space-x-4">
                          <div className="p-2 rounded-full bg-orange-500/10">
                            <Bell className="h-6 w-6 text-orange-500" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Notifications</p>
                            <p className="text-sm text-muted-foreground">Activées</p>
                          </div>
                           
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Activité récente</CardTitle>
                    <CardDescription>Historique de vos actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative space-y-6">
                      {activityItems.map((item, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className={`p-2 rounded-full ${item.color} text-white`}>
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground">{item.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders">
                <Card className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle>Mes commandes</CardTitle>
                    <CardDescription>Historique de vos commandes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/10 mb-4">
                        <Package className="h-10 w-10 text-orange-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Aucune commande</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Vous n'avez pas encore passé de commande
                      </p>
                      <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
                        Découvrir nos produits
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

               
            </Tabs>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
    </div>
  )
}
