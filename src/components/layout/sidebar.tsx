"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BarChart3,
  Building,
  Truck,
  Package,
  Users,
  FileText,
  Settings,
  Wrench,
  DollarSign,
  Warehouse,
  Route,
  CreditCard,
  Menu,
} from "lucide-react";
import { useState } from "react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    name: "Master Data",
    href: "/dashboard/master-data",
    icon: Building,
    children: [
      { name: "Customers", href: "/dashboard/master-data/customers" },
      { name: "Vendors", href: "/dashboard/master-data/vendors" },
      { name: "Vehicles", href: "/dashboard/master-data/vehicles" },
      { name: "Drivers", href: "/dashboard/master-data/drivers" },
      { name: "Locations", href: "/dashboard/master-data/locations" },
    ],
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: Package,
  },
  {
    name: "Transportation",
    href: "/dashboard/transportation",
    icon: Truck,
    children: [
      { name: "Trips", href: "/dashboard/transportation/trips" },
      { name: "Routes", href: "/dashboard/transportation/routes" },
      { name: "Tracking", href: "/dashboard/transportation/tracking" },
    ],
  },
  {
    name: "Warehouse",
    href: "/dashboard/warehouse",
    icon: Warehouse,
    children: [
      { name: "Inventory", href: "/dashboard/warehouse/inventory" },
      { name: "Locations", href: "/dashboard/warehouse/locations" },
      { name: "Transactions", href: "/dashboard/warehouse/transactions" },
    ],
  },
  {
    name: "Fleet",
    href: "/dashboard/fleet",
    icon: Wrench,
    children: [
      { name: "Vehicles", href: "/dashboard/fleet/vehicles" },
      { name: "Maintenance", href: "/dashboard/fleet/maintenance" },
      { name: "Fuel", href: "/dashboard/fleet/fuel" },
    ],
  },
  {
    name: "Billing",
    href: "/dashboard/billing",
    icon: DollarSign,
    children: [
      { name: "Invoices", href: "/dashboard/billing/invoices" },
      { name: "Tariffs", href: "/dashboard/billing/tariffs" },
      { name: "Reports", href: "/dashboard/billing/reports" },
    ],
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Users",
    href: "/dashboard/users",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <h1 className="text-xl font-semibold text-gray-900">
            Logistics ERP
          </h1>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || 
                           (item.children && item.children.some(child => pathname === child.href));
            
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
                
                {item.children && !collapsed && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                            isChildActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          )}
                        >
                          <span className="h-1 w-1 bg-current rounded-full" />
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </ScrollArea>
    </div>
  );
}