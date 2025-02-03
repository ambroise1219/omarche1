import React from 'react'; 
import ActiveDeliveries from './ActiveDeliveries';
import StatCards from './StatCards'; 
import SalesChart from './SalesChart';

const DashboardOverview = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
               <StatCards />
             <ActiveDeliveries />
          
                   <div >
          
                <SalesChart />
            </div>
        </div>
    );
};

export default DashboardOverview;
