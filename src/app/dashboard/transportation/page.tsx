"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Route, MapPin, TruckIcon, Clock } from "lucide-react";
import Link from "next/link";

const transportationItems = [
    {
        title: "Trips",
        description: "Manage active and planned transportation trips",
        icon: TruckIcon,
        href: "/dashboard/transportation/trips",
        count: 45,
        badge: "12 Active",
    },
    {
        title: "Live Tracking",
        description: "Real-time tracking of vehicles and shipments",
        icon: MapPin,
        href: "/dashboard/transportation/tracking",
        count: 28,
        badge: "Live",
    },
];

const recentTrips = [
    { id: "TRP001", origin: "Dallas", destination: "Houston", status: "in_transit", driver: "John Smith", eta: "2 hrs" },
    { id: "TRP002", origin: "Los Angeles", destination: "San Diego", status: "delivered", driver: "Mike Johnson", eta: "-" },
    { id: "TRP003", origin: "Chicago", destination: "Detroit", status: "planned", driver: "Tom Wilson", eta: "Tomorrow" },
    { id: "TRP004", origin: "Miami", destination: "Orlando", status: "in_transit", driver: "David Brown", eta: "4 hrs" },
    { id: "TRP005", origin: "Seattle", destination: "Portland", status: "loading", driver: "Chris Lee", eta: "6 hrs" },
];

const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        in_transit: "default",
        delivered: "secondary",
        planned: "outline",
        loading: "default",
    };
    return <Badge variant={variants[status] || "outline"}>{status.replace("_", " ").toUpperCase()}</Badge>;
};

export default function TransportationPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Transportation</h1>
                <p className="text-gray-600">Manage trips, routes, and live tracking</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {transportationItems.map((item) => (
                    <Link key={item.title} href={item.href}>
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                                <item.icon className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <CardDescription className="mb-2">{item.description}</CardDescription>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-2xl font-bold">{item.count}</p>
                                        <p className="text-xs text-muted-foreground">Total</p>
                                    </div>
                                    <Badge variant="outline">{item.badge}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {/* Quick Stats Card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-lg font-medium">Today's Overview</CardTitle>
                        <Clock className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Active Trips</span>
                                <span className="font-bold">12</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Completed</span>
                                <span className="font-bold">8</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Delayed</span>
                                <span className="font-bold text-red-500">2</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">On Time Rate</span>
                                <span className="font-bold text-green-500">94%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Trips Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Trips</CardTitle>
                    <CardDescription>Latest transportation activities</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium">Trip ID</th>
                                    <th className="text-left py-3 px-4 font-medium">Route</th>
                                    <th className="text-left py-3 px-4 font-medium">Driver</th>
                                    <th className="text-left py-3 px-4 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 font-medium">ETA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTrips.map((trip) => (
                                    <tr key={trip.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{trip.id}</td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <span>{trip.origin}</span>
                                                <Route className="h-3 w-3 text-gray-400" />
                                                <span>{trip.destination}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">{trip.driver}</td>
                                        <td className="py-3 px-4">{getStatusBadge(trip.status)}</td>
                                        <td className="py-3 px-4">{trip.eta}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
