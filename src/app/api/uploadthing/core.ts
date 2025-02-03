import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

/**
 * Configuration du routeur de fichiers pour UploadThing
 * Définit les types de fichiers acceptés et les règles de téléchargement
 */
export const ourFileRouter = {
  // Configuration pour les images de produits
  productImage: f({ 
    image: { maxFileSize: "4MB", maxFileCount: 5 } 
  })
    .middleware(async ({ req }) => {
      // Pour l'instant, pas d'authentification requise
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload terminé le:", metadata.uploadedAt);
      console.log("URL du fichier:", file.url);
      
      return { 
        uploadedAt: metadata.uploadedAt,
        fileUrl: file.url 
      };
    }),

  // Configuration pour les images de catégories
  categoryImage: f({ 
    image: { maxFileSize: "2MB", maxFileCount: 1 } 
  })
    .middleware(async ({ req }) => {
      return { uploadedAt: new Date().toISOString() };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload terminé le:", metadata.uploadedAt);
      console.log("URL du fichier:", file.url);
      
      return { 
        uploadedAt: metadata.uploadedAt,
        fileUrl: file.url 
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
