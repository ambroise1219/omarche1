import { createUploadthing } from "uploadthing/next"
 
const f = createUploadthing()
 
export const ourFileRouter = {
  // Définir les routes d'upload pour les images de profil
  profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedBy: "user" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload terminé pour le profile:", file.url)
      return { uploadedBy: metadata.uploadedBy, url: file.url }
    }),

  // Définir les routes d'upload pour les images de produits
  productImage: f({ image: { maxFileSize: "4MB", maxFileCount: 4 } })
    .middleware(async () => {
      return { uploadedBy: "user" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload terminé pour les produits:", file.url)
      return { uploadedBy: metadata.uploadedBy, url: file.url }
    }),

  // Définir les routes d'upload pour les images de catégories
  categoryImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return { uploadedBy: "user" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload terminé pour les catégories:", file.url)
      return { uploadedBy: metadata.uploadedBy, url: file.url }
    }),
}
