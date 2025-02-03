"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { Badge } from "../../ui/badge"
import { ScrollArea } from "../../ui/scroll-area"
import { ShoppingBag, Clock, Package, ChevronRight } from "lucide-react"

/**
 * Composant affichant la liste des commandes récentes avec un design e-commerce moderne
 * @returns {JSX.Element} Liste des commandes récentes
 */
export default function RecentOrders() {
  // Données factices basées sur le schéma de la base de données
  const orders = [
    {
      id: "ORD-001",
      user: "Jean Dupont",
      total: 156.99,
      status: "en_livraison",
      items: 3,
      date: "Il y a 30 min",
      products: ["iPhone 13", "Coque Protection", "Chargeur"]
    },
    {
      id: "ORD-002",
      user: "Marie Martin",
      total: 89.99,
      status: "en_preparation",
      items: 2,
      date: "Il y a 45 min",
      products: ["Nike Air Max", "Chaussettes Sport"]
    },
    {
      id: "ORD-003",
      user: "Pierre Durand",
      total: 245.50,
      status: "livre",
      items: 4,
      date: "Il y a 1h",
      products: ["MacBook Air", "Souris", "Clavier", "Support"]
    },
    {
      id: "ORD-004",
      user: "Sophie Bernard",
      total: 178.25,
      status: "en_attente",
      items: 3,
      date: "Il y a 2h",
      products: ["Robe d'été", "Sandales", "Sac"]
    }
  ]

  const getStatusStyles = (status) => {
    const styles = {
      en_livraison: "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20 border-orange-500/20",
      en_preparation: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20",
      livre: "bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20",
      en_attente: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-gray-500/20"
    }
    return styles[status] || styles.en_attente
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-orange-100 rounded-lg">
            <ShoppingBag className="w-5 h-5 text-orange-600" />
          </div>
          <CardTitle className="text-xl font-semibold">Commandes Récentes</CardTitle>
        </div>
        <Badge className="bg-orange-500 hover:bg-orange-600">
          {orders.length} nouvelles
        </Badge>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="group p-4 border rounded-xl bg-card hover:bg-accent/50 transition-all duration-200 hover:shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Package className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium flex items-center gap-2">
                        {order.user}
                        <Badge className={getStatusStyles(order.status)}>
                          {order.status.replace("_", " ")}
                        </Badge>
                      </h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-3 w-3" />
                        {order.date}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{order.total.toFixed(2)}€</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items} articles
                    </p>
                  </div>
                </div>
                <div className="pl-11">
                  <div className="text-sm text-muted-foreground">
                    {order.products.join(" • ")}
                  </div>
                </div>
                <div className="mt-2 pl-11 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center">
                    Voir les détails
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
