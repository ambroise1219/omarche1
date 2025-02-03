"use client"

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin"
import { extractRouterConfig } from "uploadthing/server"
import { ourFileRouter } from "../app/api/uploadthing/core"

/**
 * Provider pour la fonctionnalité d'upload
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 * @returns {JSX.Element} Provider uploadthing
 */
export function UploadProvider({ children }) {
  return (
    <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)}>
      {children}
    </NextSSRPlugin>
  )
}
