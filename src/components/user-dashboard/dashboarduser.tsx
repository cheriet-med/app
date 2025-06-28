
import { useSession, signOut } from "next-auth/react";
import { useLocale } from "next-intl";
import UserMenu from "./menu";
import PercentageStepper from "./stepper";

import useFetchOrdersForUser from "./FetchOrderId";


export default function DashboardUser () {
    const locale = useLocale(); // Get the current locale
    const { orderId, error, isLoading } = useFetchOrdersForUser();

    const sum = orderId
    .filter(order => order.status === "hide" || order.status === "completed")
    .reduce((total, order) => total + parseFloat(order.price), 0);

    const formattedSum = sum.toFixed(2); 
   
    return (
    
              <div className="font-sans mx-6 md:mx-16 custom:mx-60 py-12">
          User Dashboard
          </div>
         
    )
}