"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Badge } from "../ui/badge" 
import { Button } from "../ui/button"  
import { Card } from "../ui/card"  
import { Progress }  from "../ui/progress"  
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "sonner"

const statusConfig = {
  pending: { label: "En attente", color: "yellow", progress: 0 },
  preparing: { label: "En préparation", color: "blue", progress: 25 },
  pickup: { label: "Prêt pour ramassage", color: "purple", progress: 50 },
  delivering: { label: "En livraison", color: "orange", progress: 75 },
  completed: { label: "Livrée", color: "green", progress: 100 },
  cancelled: { label: "Annulée", color: "red", progress: 0 }
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { label: status, color: "gray", progress: 0 };
  return (
    <Badge variant="outline" className={`bg-${config.color}-50 text-${config.color}-600 border-${config.color}-200`}>
      {config.label}
    </Badge>
  );
};

export default function DeliveriesContent() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/deliveries");
      const data = await response.json();
      setDeliveries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erreur lors du chargement des livraisons:", error);
      toast.error("Erreur lors du chargement des livraisons");
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      const response = await fetch(`/api/deliveries/${deliveryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du statut");
      }

      toast.success(`Statut mis à jour : ${statusConfig[newStatus].label}`);
      fetchDeliveries();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la mise à jour du statut");
    }
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = 
      delivery.delivery_person_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.order_id?.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || delivery.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Livraisons</h2>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Rechercher par livreur ou commande..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrer par statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(statusConfig).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <Card className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce" />
            </div>
          </Card>
        ) : filteredDeliveries.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            Aucune livraison trouvée
          </Card>
        ) : (
          filteredDeliveries.map((delivery) => (
            <Card key={delivery.id} className="p-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={delivery.status} />
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(delivery.created_at), "PPp", { locale: fr })}
                      </span>
                    </div>
                    <h3 className="font-medium">Commande #{delivery.order_id}</h3>
                    <p className="text-sm text-muted-foreground">Livreur: {delivery.delivery_person_name}</p>
                    {delivery.latitude && delivery.longitude && (
                      <p className="text-sm mt-1">
                        Position: {delivery.latitude}, {delivery.longitude}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <Select
                      value={delivery.status}
                      onValueChange={(value) => updateDeliveryStatus(delivery.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Changer le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(statusConfig).map(([value, { label }]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Progress value={statusConfig[delivery.status]?.progress || 0} className="h-2" />
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}