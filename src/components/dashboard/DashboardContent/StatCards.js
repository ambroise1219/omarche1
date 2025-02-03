"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Package, ShoppingBag, Users, CreditCard, TrendingUp, ArrowUpRight } from "lucide-react"

/**
 * Composant affichant les cartes de statistiques principales du tableau de bord e-commerce
 * @returns {JSX.Element} Grille de cartes de statistiques
 */
export default function StatCards() {
  // Données factices basées sur le schéma de la base de données
  const stats = [
    {
      title: "Ventes du Jour",
      value: "2,345",
      icon: CreditCard,
      description: "+180 commandes aujourd'hui",
      trend: "+12%",
      color: "orange",
      bgLight: "bg-orange-50",
      bgDark: "bg-orange-500"
    },
    {
      title: "Revenus Mensuels",
      value: "45,231",
      icon: ShoppingBag,
      description: "+3,250€ vs mois dernier",
      trend: "+8%",
      color: "green",
      bgLight: "bg-green-50",
      bgDark: "bg-green-500"
    },
    {
      title: "Produits Actifs",
      value: "432",
      icon: Package,
      description: "12 en rupture de stock",
      trend: "-2%",
      color: "orange",
      bgLight: "bg-orange-50",
      bgDark: "bg-orange-500"
    },
    {
      title: "Nouveaux Clients",
      value: "1,234",
      icon: Users,
      description: "+48 cette semaine",
      trend: "+15%",
      color: "green",
      bgLight: "bg-green-50",
      bgDark: "bg-green-500"
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="hover:shadow-lg transition-all duration-200 group cursor-pointer overflow-hidden relative"
        >
          <div className={`absolute right-0 top-0 w-24 h-24 rounded-full ${stat.bgLight} -mr-6 -mt-6 opacity-50 group-hover:scale-110 transition-transform`} />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgLight}`}>
              <stat.icon className={`h-4 w-4 text-${stat.color}-600`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline space-x-3">
              <div className="text-2xl font-bold">{stat.value} CFA</div>
              <div className={`flex items-center text-xs ${
                stat.trend.startsWith("+") ? "text-green-600" : "text-red-600"
              }`}>
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {stat.trend}
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              <div className={`text-${stat.color}-600 opacity-0 group-hover:opacity-100 transition-opacity`}>
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
