"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Package, 
  Search,
  Truck,
  XCircle
} from "lucide-react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import { Badge } from "../ui/badge"
import { toast } from "sonner"
import Image from "next/image"

const statusConfig = {
  completed: { label: "Terminée", color: "green" },
  processing: { label: "En cours", color: "orange" },
  shipping: { label: "En livraison", color: "blue" },
  pending: { label: "En attente", color: "yellow" },
  cancelled: { label: "Annulée", color: "red" }
}

export default function OrdersContent() {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/orders")
      const data = await response.json()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Erreur lors du chargement des commandes:", error)
      toast.error("Erreur lors du chargement des commandes")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log('📝 Tentative mise à jour statut:', { orderId, newStatus });
      
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour envoyer les cookies
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      console.log('🔄 Statut réponse:', response.status);

      const data = await response.json();
      console.log('📦 Réponse:', data);

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour du statut");
      }

      toast.success(`Statut mis à jour : ${statusConfig[newStatus].label}`);
      await fetchOrders();
    } catch (error) {
      console.error("❌ Erreur mise à jour:", error);
      if (error.message === 'Non authentifié') {
        router.push('/auth');
      }
      toast.error(error.message);
    }
  }

  const filteredOrders = useMemo(() => {
    if (!isClient) return orders

    return orders.filter(order => {
      const matchesSearch = 
        order.id.toString().includes(searchTerm) ||
        order.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.email?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter, isClient])

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || { label: status, color: "gray" };
    return (
      <Badge variant="outline" className={`bg-${config.color}-50 text-${config.color}-600 border-${config.color}-200`}>
        {config.label}
      </Badge>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Commandes</CardTitle>
        </CardHeader>
        <CardContent>
          {isClient && (
            <div className="space-y-4 mb-6">
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <Input
                    placeholder="Rechercher par ID, client ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    icon={Search}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-[200px]">
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
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Produits</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-4 h-4 rounded-full bg-orange-500 animate-bounce" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                      Aucune commande trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>#{order.id}</TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="relative h-10 w-10 rounded overflow-hidden">
                                <Image 
                                  src={item.product.image_url || '/placeholder.png'}
                                  alt={item.product.name}
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium">{item.product.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.quantity}x - {item.price.toLocaleString()} FCFA
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.username}</p>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">{order.phone_number}</p>
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.created_at), "PPp", { locale: fr })}
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.total.toLocaleString()} FCFA
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={order.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:bg-orange-100 hover:text-orange-600"
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            Détails
                          </Button>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[140px]">
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
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de la commande #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Commande passée le {selectedOrder && format(new Date(selectedOrder.created_at), "PPp", { locale: fr })}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-2">Client</h4>
              <div className="text-sm">
                <p className="font-medium">{selectedOrder?.username}</p>
                <p className="text-muted-foreground">{selectedOrder?.email}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Articles</h4>
              <div className="space-y-2">
                {selectedOrder?.items?.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x Produit #{item.product_id}
                    </span>
                    <span className="font-medium">
                      {(item.price * item.quantity).toLocaleString()} CFA
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t">
              <span className="font-medium">Total</span>
              <span className="font-medium">
                {selectedOrder?.total.toLocaleString()} CFA
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
