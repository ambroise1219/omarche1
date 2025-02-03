"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
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
  DialogTrigger,
} from "../ui/dialog"
import { toast } from "sonner" 
import { UploadButton } from "../../utils/uploadthing"
import Image from "next/image"

/**
 * Composant de gestion des catégories
 * @returns {JSX.Element} Interface de gestion des catégories
 */
export default function CategoriesContent() {
  const router = useRouter()
  
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [editingCategory, setEditingCategory] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!isClient) return categories;

    return categories.filter((category) => {
      const matchesSearch = 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [categories, searchTerm, isClient]);

  // Charger les catégories au montage
  useEffect(() => {
    fetchCategories()
  }, [])

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setImageUrl("");
    setEditingCategory(null);
  };

  // Ouvrir le dialogue d'édition
  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
    });
    setImageUrl(category.image_url || "");
    setIsDialogOpen(true);
  };

  // Récupérer les catégories
  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories")
      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error("Erreur lors du chargement des catégories:", error)
      toast.error("Impossible de charger les catégories")
    }
  }

  // Gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation côté client
    if (!formData.name.trim()) {
      toast.error("Le nom de la catégorie est requis")
      setLoading(false)
      return
    }

    if (formData.name.length > 100) {
      toast.error("Le nom de la catégorie ne doit pas dépasser 100 caractères")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la création")
      }

      toast.success("Catégorie créée avec succès")

      // Réinitialiser le formulaire et recharger les catégories
      resetForm()
      setIsDialogOpen(false)
      fetchCategories()
    } catch (error) {
      console.error("Erreur lors de la création:", error)
      toast.error(error.message || "Impossible de créer la catégorie")
    } finally {
      setLoading(false)
    }
  }

  // Gérer la mise à jour d'une catégorie
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la mise à jour");
      }

      toast.success("Catégorie mise à jour avec succès");
      resetForm();
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(error.message || "Impossible de mettre à jour la catégorie");
    } finally {
      setLoading(false);
    }
  };

  // Gérer la suppression d'une catégorie
  const handleDelete = async (category) => {
    try {
      const response = await fetch(`/api/categories/${category.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.details?.message) {
          // Message d'erreur personnalisé pour les catégories avec des produits
          toast.error(data.details.message, {
            description: "Veuillez d'abord gérer les produits associés à cette catégorie.",
           
            duration: 8000
          });
        } else {
          throw new Error(data.error || "Erreur lors de la suppression");
        }
        return;
      }

      toast.success("Catégorie supprimée avec succès");
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Impossible de supprimer la catégorie", {
        description: error.message
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Catégories</h2>
        <Button
          onClick={() => {
            resetForm();
            setIsDialogOpen(true);
          }}
          className="bg-orange-500 p-2 text-white font-bold px-3 hover:bg-orange-600"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Catégorie
        </Button>
      </div>

      {/* Filtres et recherche */}
      {isClient && (
        <div className="space-y-4 my-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <Input
                placeholder="Rechercher une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {/* Dialogue de création/édition */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier la catégorie" : "Créer une nouvelle catégorie"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory 
                ? "Modifiez les informations de la catégorie."
                : "Ajoutez une nouvelle catégorie de produits à votre catalogue."
              }
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={editingCategory ? handleUpdate : handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom de la catégorie</Label>
                <Input
                  id="name"
                  placeholder="Ex: Fruits & Légumes"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Description de la catégorie..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Image de la catégorie</Label>
                <div className="flex items-center gap-4">
                  {imageUrl && (
                    <div className="relative group">
                      <Image 
                        src={imageUrl} 
                        alt="Aperçu" 
                        className="w-20 h-20 rounded-lg object-contain"
                        width={200}
                        height={200}
                      />
                      <button
                        type="button"
                        onClick={() => setImageUrl("")}
                        className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <div className="flex-1">
                    <UploadButton
                      endpoint="categoryImage"
                      onClientUploadComplete={(res) => {
                        if (res?.[0]?.url) {
                          setImageUrl(res[0].url);
                          toast.success("Image téléchargée avec succès");
                        }
                      }}
                      onUploadError={(error) => {
                        toast.error(`Erreur: ${error.message}`);
                      }}
                      appearance={{
                        button: "bg-orange-500 p-2 hover:bg-orange-600",
                        container: "w-full"
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Format : JPG, PNG. Taille maximale : 2MB
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button 
                type="button" 
                className="p-2 text-white bg-slate-700 hover:bg-slate-900"
                variant="outline" 
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
                  ? (editingCategory ? "Mise à jour..." : "Création...") 
                  : (editingCategory ? "Mettre à jour" : "Créer")
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
              Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible.
              {"\n"}Note : La suppression est impossible si des produits sont associés à cette catégorie.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCategoryToDelete(null);
              }}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => categoryToDelete && handleDelete(categoryToDelete)}
            >
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Liste des catégories */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="group relative transition-all duration-300 hover:shadow-lg hover:shadow-orange-100">
            <CardHeader className="relative h-[200px] overflow-hidden">
              <Image
                src={category.image_url || "/placeholder.png"}
                alt={category.name}
                width={400}
                height={400}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/50 to-transparent p-4 transition-all duration-300 group-hover:from-black/60">
                <CardTitle className="text-white transition-transform duration-300 group-hover:translate-y-[-2px]">
                  {category.name}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {category.description || "Aucune description"}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="transition-colors duration-300 hover:bg-orange-100 hover:text-orange-600"
                    onClick={() => {
                      setEditingCategory(category);
                      setFormData({
                        name: category.name,
                        description: category.description || "",
                      });
                      setImageUrl(category.image_url || "");
                      setIsDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="transition-colors duration-300 hover:bg-red-100 hover:text-red-600"
                    onClick={() => {
                      setCategoryToDelete(category);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
