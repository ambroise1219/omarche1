'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";  
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    
    console.log('Envoi de la requête de connexion:', {
      email: formData.email,
      passwordLength: formData.password.length
    });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include'  // Important pour les cookies
      });

      const data = await response.json();
      console.log('Réponse de connexion:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      // Stocke le token
      localStorage.setItem('auth_token', data.token);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">O-Marche Admin</h1>
          <p className="text-gray-600">Connectez-vous à votre dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Mot de passe
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
