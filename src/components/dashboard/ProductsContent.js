"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { toast } from "sonner"
import { UploadButton } from "../../utils/uploadthing"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"
import { useRouter } from "next/navigation"
 

/**
 * Composant de gestion des produits
 * @returns {JSX.Element} Interface de gestion des produits
 */
export default function ProductsContent() {
  const router = useRouter();
  
  // Utilisation de useEffect pour initialiser les états après le montage du composant
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(() => ({
    category: "all",
    minPrice: "",
    maxPrice: "",
    inStock: false
  }));

  // État pour gérer l'affichage initial
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Filtrer les produits côté client uniquement
  const filteredProducts = useMemo(() => {
    if (!isClient) return products;

    return products.filter((product) => {
      // Filtre par recherche
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtre par catégorie
      const matchesCategory = filters.category === "all" || product.category_id.toString() === filters.category;

      // Filtre par prix
      const matchesMinPrice = !filters.minPrice || product.price >= parseFloat(filters.minPrice);
      const matchesMaxPrice = !filters.maxPrice || product.price <= parseFloat(filters.maxPrice);

      // Filtre par stock
      const matchesStock = !filters.inStock || product.stock > 0;

      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock;
    });
  }, [products, searchTerm, filters, isClient]);

  const [images, setImages] = useState([])
  const [editingProduct, setEditingProduct] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: ""
  })

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      category_id: ""
    });
    setImages([]);
    setEditingProduct(null);
  };

  // Charger les produits et catégories au montage
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  // Récupérer les produits
  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setProducts(data)
    } catch (error) {
      console.error("Erreur lors du chargement des produits:", error)
      toast.error("Impossible de charger les produits")
    }
  }

  // Récupérer les catégories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      console.log('Catégories récupérées:', data);
      setCategories(data);
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error);
      toast.error("Impossible de charger les catégories");
    }
  }

  // Ouvrir le dialogue d'édition
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      category_id: product.category_id.toString()
    });
    setImages(product.images || []);
    setIsDialogOpen(true);
  };

  // Gérer la création d'un produit
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!formData.category_id) {
      toast.error("Veuillez sélectionner une catégorie");
      return;
    }
    
    setLoading(true);
    
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: formData.category_id,
        images: images.map(img => img.image_url || img.url)
      };

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success("Produit créé avec succès")
      resetForm()
      setIsDialogOpen(false)
      fetchProducts()
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast.error(error.message || "Impossible de créer le produit")
    } finally {
      setLoading(false)
    }
  }

  // Gérer la mise à jour d'un produit
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updateData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category_id: formData.category_id,
        images: images.map(img => ({ url: img.image_url || img.url }))
      };

      console.log('=== DÉBUT DE LA MISE À JOUR CÔTÉ CLIENT ===');
      console.log('ID du produit:', editingProduct.id);
      console.log('Données à envoyer:', updateData);

      const response = await fetch(`/api/products/${editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      console.log('Statut de la réponse:', response.status);
      console.log('Headers de la réponse:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      console.log('Texte de la réponse:', responseText);

      if (!response.ok) {
        throw new Error(responseText || "Erreur lors de la mise à jour");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Erreur lors du parsing de la réponse:', parseError);
        throw new Error("Réponse invalide du serveur");
      }

      console.log('Données reçues après mise à jour:', data);
      
      toast.success("Produit mis à jour avec succès");
      resetForm();
      setIsDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(error.message || "Impossible de mettre à jour le produit");
    } finally {
      console.log('=== FIN DE LA MISE À JOUR CÔTÉ CLIENT ===');
      setLoading(false);
    }
  }

  // Gérer la suppression d'un produit
  const handleDelete = async (product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error)

      toast.success("Produit supprimé avec succès")
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
      fetchProducts()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast.error(error.message || "Impossible de supprimer le produit")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Produits</h2>
        <Button 
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-orange-500 p-2 text-white font-bold px-3 hover:bg-orange-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Produit
        </Button>
      </div>

      {/* Filtres et recherche - affichés uniquement côté client */}
      {isClient && (
        <div className="space-y-4 my-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-4 items-center">
            <Input
              type="number"
              placeholder="Prix min"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              className="w-[150px]"
            />
            <Input
              type="number"
              placeholder="Prix max"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="w-[150px]"
            />
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span>En stock uniquement</span>
            </label>
          </div>
        </div>
      )}

      {/* Dialogue de création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Modifier le produit" : "Créer un nouveau produit"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? "Modifiez les informations du produit."
                : "Ajoutez un nouveau produit à votre catalogue."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editingProduct ? handleUpdate : handleCreate} className="space-y-6">
            <div className="grid gap-6 grid-cols-2">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Nom du produit</Label>
                <Input
                  id="name"
                  placeholder="Ex: Pommes Bio"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Prix (CFA)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  placeholder="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="category">Catégorie</Label>
                <Select
                  defaultValue=""
                  value={formData.category_id}
                  onValueChange={(value) => {
                    setFormData(prev => ({
                      ...prev,
                      category_id: value
                    }));
                  }}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sélectionnez une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description du produit..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Images du produit ({images.length}/5)</Label>
                <div className="grid grid-cols-5 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <Image
                        src={image.image_url || image.url}
                        alt={`Image ${index + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-24 object-contain rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== index))}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  {images.length < 5 && (
                    <div className="w-full h-24 border-2 border-dashed rounded-lg border-muted-foreground/25">
                      <UploadButton
                        endpoint="productImage"
                        onClientUploadComplete={(res) => {
                          if (res?.[0]?.url) {
                            setImages([...images, { url: res[0].url }]);
                            toast.success("Image téléchargée avec succès");
                          }
                        }}
                        onUploadError={(error) => {
                          toast.error(`Erreur: ${error.message}`);
                        }}
                        appearance={{
                          button: "bg-orange-500 p-2 hover:bg-orange-600",
                          container: "w-full h-full flex items-center justify-center"
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Format recommandé : JPG, PNG. Taille maximale : 4MB
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                variant="outline"
                className="p-2 text-white bg-slate-700 hover:bg-slate-900"
                onClick={() => {
                  resetForm();
                  setIsDialogOpen(false);
                }}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                className="bg-orange-500 p-2 px-3 text-white hover:bg-orange-600"
                disabled={loading}
              >
                {loading 
                  ? (editingProduct ? "Mise à jour..." : "Création...") 
                  : (editingProduct ? "Mettre à jour" : "Créer")
                }
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialogue de confirmation de suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              className="p-2 text-white bg-slate-700 hover:bg-slate-900"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setProductToDelete(null);
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => productToDelete && handleDelete(productToDelete)}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Liste des produits */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group relative transition-all duration-300 hover:shadow-lg hover:shadow-orange-100">
            <CardHeader className="relative h-[200px] overflow-hidden">
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {product.images && product.images.length > 0 ? (
                    product.images.map((image, index) => (
                      <CarouselItem key={image.id || index} data-index={index}>
                        <Image
                          src={image.image_url}
                          alt={`${product.name} - Image ${index + 1}`}
                          width={400}
                          height={400}
                          className="absolute inset-0 w-full h-full object-contain rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                        />
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem data-index={0}>
                      <Image
                        src="/produitplaceholder.jpg"
                        alt={product.name}
                        width={400}
                        height={400}
                        className="absolute inset-0 w-full h-full object-contain rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                      />
                    </CarouselItem>
                  )}
                </CarouselContent>
                {product.images && product.images.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CarouselNext className="right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                )}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4 transition-all duration-300 group-hover:from-black/60">
                  <CardTitle className="text-white transition-transform duration-300 group-hover:translate-y-[-2px]">
                    {product.name}
                  </CardTitle>
                </div>
              </Carousel>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || "Aucune description"}
                  </p>
                  <p className="text-lg font-bold text-orange-500 transition-all duration-300 group-hover:text-orange-600 group-hover:translate-y-[-2px]">
                    {typeof product.price === 'number' ? product.price.toFixed(2) : parseFloat(product.price).toFixed(2)} CFA
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="transition-colors duration-300 hover:bg-orange-100 hover:text-orange-600"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="transition-colors duration-300 hover:bg-red-100 hover:text-red-600"
                    onClick={() => {
                      setProductToDelete(product);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Stock: <span className="font-medium">{product.stock}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
