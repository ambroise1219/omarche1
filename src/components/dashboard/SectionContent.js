import React from 'react';
import DashboardContent from './DashboardContent/DashboardContent';
import ProductsContent from './ProductsContent';
import CategoriesContent from './CategoriesContent';
import OrdersContent from './OrdersContent';
import UsersContent from './UsersContent';
import BannersContent from './BannersContent';
import SettingsContent from './SettingsContent';

const SectionContent = ({ section }) => {
    switch (section) {
        case "dashboard":
            return <DashboardContent />;
        case "products":
            return <ProductsContent />;
        case "categories":
            return <CategoriesContent />;
        case "orders":
            return <OrdersContent />;
        case "users":
            return <UsersContent />;
        case "banners":
            return <BannersContent />;
        case "settings":
            return <SettingsContent />;
        default:
            return <div className="text-gray-500">Section en construction...</div>;
    }
};

export default SectionContent;
