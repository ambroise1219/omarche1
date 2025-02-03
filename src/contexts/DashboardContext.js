"use client"

import { createContext, useContext, useState } from "react"

/**
 * Contexte pour gérer l'état global du dashboard
 * @type {React.Context}
 */
const DashboardContext = createContext(undefined)

/**
 * Hook personnalisé pour utiliser le contexte du dashboard
 * @returns {Object} Contexte du dashboard
 */
export function useDashboard() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error("useDashboard doit être utilisé à l'intérieur d'un DashboardProvider")
  }
  return context
}

/**
 * Provider pour le contexte du dashboard
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 * @returns {JSX.Element} Provider du contexte
 */
export function DashboardProvider({ children }) {
  const [activeSection, setActiveSection] = useState("overview")

  console.log("Current active section:", activeSection) // Debug log

  const value = {
    activeSection,
    setActiveSection: (section) => {
      console.log("Setting active section to:", section) // Debug log
      setActiveSection(section)
    }
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}
