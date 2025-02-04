'use client'

import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'  
import { Button } from '../ui/button'  
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { toast } from 'sonner'
import { Edit2, Save } from 'lucide-react'

export function ProfileSection() {
  const { user } = useAuth()
 
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    phone: user?.phone_number || '',
    address: user?.address || ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profil mis à jour avec succès')
      setIsEditing(false)
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil')
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-4 mb-8">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.profile_image_url} />
            <AvatarFallback>
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {user.username || 'Mon Profil'}
            </h1>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <Input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Téléphone
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse
              </label>
              <Input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            {!isEditing ? (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                variant="outline"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Annuler
                </Button>
                <Button type="submit" variant="default">
                  <Save className="w-4 h-4 mr-2" />
                  Enregistrer
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
