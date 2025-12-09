"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Truck, MapPin, UserCircle } from "lucide-react";
import Link from "next/link";

const masterDataItems = [
  {
    title: "Customers",
    description: "Manage customer accounts and contact information",
    icon: Users,
    href: "/dashboard/master-data/customers",
    count: 156,
  },
  {
    title: "Vendors",
    description: "Manage vendor partnerships and contracts",
    icon: Building,
    href: "/dashboard/master-data/vendors",
    count: 42,
  },
  {
    title: "Vehicles",
    description: "Track fleet vehicles and maintenance schedules",
    icon: Truck,
    href: "/dashboard/master-data/vehicles",
    count: 89,
  },
  {
    title: "Drivers",
    description: "Manage driver profiles and certifications",
    icon: UserCircle,
    href: "/dashboard/master-data/drivers",
    count: 124,
  },
  {
    title: "Locations",
    description: "Manage warehouses, ports, and delivery points",
    icon: MapPin,
    href: "/dashboard/master-data/locations",
    count: 67,
  },
];

export default function MasterDataPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Master Data</h1>
        <p className="text-gray-600">Manage core business entities and configurations</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {masterDataItems.map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-2">{item.description}</CardDescription>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs text-muted-foreground">Total records</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
