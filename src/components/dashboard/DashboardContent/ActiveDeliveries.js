"use client"

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card"
import { ScrollArea } from "../../ui/scroll-area"
import { Badge } from "../../ui/badge"
import { MapPin, Package, User, Clock } from "lucide-react"

/**
 * Composant affichant les livraisons actives
 * @returns {JSX.Element} Grille de cartes de livraisons
 */
export default function ActiveDeliveries() {
  const deliveries = [
    {
      id: 1,
      orderNumber: "CMD-001",
      customer: "Jean Dupont",
      address: "123 Rue de Paris, 75001 Paris",
      status: "En cours",
      items: 3,
      time: "Il y a 30 min"
    },
    {
      id: 2,
      orderNumber: "CMD-002",
      customer: "Marie Martin",
      address: "45 Avenue des Champs-Élysées, 75008 Paris",
      status: "En préparation",
      items: 2,
      time: "Il y a 45 min"
    },
    {
      id: 3,
      orderNumber: "CMD-003",
      customer: "Pierre Durand",
      address: "78 Boulevard Saint-Germain, 75006 Paris",
      status: "En route",
      items: 5,
      time: "Il y a 1h"
    },
    {
      id: 4,
      orderNumber: "CMD-004",
      customer: "Sophie Bernard",
      address: "12 Rue du Commerce, 75015 Paris",
      status: "En préparation",
      items: 1,
      time: "Il y a 1h15"
    },
    {
      id: 5,
      orderNumber: "CMD-005",
      customer: "Lucas Bernard",
      address: "22 Boulevard Saint-Michel, Paris",
      status: "En route",
      items: 4,
      time: "Il y a 20 min"
    }
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Livraisons Actives</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-1">
            {deliveries.map((delivery) => (
              <Card key={delivery.id} className="h-full">
                <CardContent className="p-4">
                  <div className="flex flex-col h-full space-y-4">
                    {/* En-tête de la carte */}
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="outline" 
                        className="bg-orange-100 text-orange-700 hover:bg-orange-100"
                      >
                        {delivery.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {delivery.time}
                      </span>
                    </div>

                    {/* Informations de la commande */}
                    <div className="space-y-4 flex-grow">
                      <div className="flex items-start gap-2">
                        <Package className="h-4 w-4 text-orange-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium">{delivery.orderNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {delivery.items} article{delivery.items > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-orange-600 mt-1" />
                        <div>
                          <p className="text-sm font-medium">{delivery.customer}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-orange-600 mt-1" />
                        <p className="text-sm text-muted-foreground break-words">
                          {delivery.address}
                        </p>
                      </div>
                    </div>

                    {/* Pied de la carte */}
                    <div className="pt-2 flex justify-end">
                      <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                        Voir les détails →
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
