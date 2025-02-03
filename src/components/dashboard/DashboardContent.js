"use client"

import { useDashboard } from "../../contexts/DashboardContext"
import DashboardOverview from "./DashboardContent/DashboardOverview"
import OrdersContent from "./OrdersContent"
import ProductsContent from "./ProductsContent"
import CustomerContent from "./CustomerContent"
import SettingsContent from "./SettingsContent"
import CategoriesContent from "./CategoriesContent"
import DeliveriesContent from "./DeliveriesContent"

/**
 * Contenu principal du dashboard qui change en fonction de la section active
 * @returns {JSX.Element} Contenu dynamique du dashboard
 */
export default function DashboardContent() {
  const { activeSection } = useDashboard()

  // Rendu conditionnel en fonction de la section active
  const renderContent = () => {
    console.log("Rendering content for section:", activeSection) // Debug log

    let content = null;

    switch (activeSection) {
      case "overview":
        content = <DashboardOverview />
        break;
      case "orders":
        content = <OrdersContent />
        break;
      case "products":
        content = <ProductsContent />
        break;
      case "categories":
        content = <CategoriesContent />
        break;
      case "deliveries":
        content = <DeliveriesContent />
        break;
      case "customers":
        content = <CustomerContent />
        break;
      case "settings":
        content = <SettingsContent />
        break;
      default:
        content = (
          <div>
            <h2 className="text-2xl font-semibold">Section en construction</h2>
            <p>Section actuelle : {activeSection}</p>
          </div>
        )
    }

    console.log("Content to render:", content ? "Component exists" : "No component") // Debug log
    return content;
  }

  const content = renderContent();
  console.log("Final content:", content ? "Ready to render" : "Nothing to render") // Debug log

  if (!content) {
    return <div>Loading...</div>
  }

  return (
    <div className="w-full">
      {content}
    </div>
  )
}
