/**
 * Provider global pour l'application
 * @param {Object} props - Propriétés du composant
 * @param {React.ReactNode} props.children - Composants enfants
 * @returns {JSX.Element} Provider global
 */
"use client"

export function Providers({ children }) {
  return children;
}
