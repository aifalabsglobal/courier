"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, Wrench, Fuel, AlertTriangle, CheckCircle } from "lucide-react";
import Link from "next/link";

const fleetItems = [
    {
        title: "Maintenance",
        description: "Schedule and track vehicle maintenance",
        icon: Wrench,
        href: "/dashboard/fleet/maintenance",
        count: 15,
        badge: "3 Due",
    },
];

const fleetStats = [
    { label: "Total Vehicles", value: "89", icon: Truck },
    { label: "Active", value: "72", icon: CheckCircle },
    { label: "In Maintenance", value: "8", icon: Wrench },
    { label: "Alerts", value: "5", icon: AlertTriangle },
];

const upcomingMaintenance = [
    { vehicle: "TRK-001", type: "Oil Change", due: "Tomorrow", priority: "high" },
    { vehicle: "TRK-015", type: "Tire Rotation", due: "2 days", priority: "medium" },
    { vehicle: "TRK-023", type: "Brake Inspection", due: "3 days", priority: "high" },
    { vehicle: "VAN-007", type: "A/C Service", due: "5 days", priority: "low" },
    { vehicle: "TRK-042", type: "Full Service", due: "1 week", priority: "medium" },
];

const recentFuel = [
    { vehicle: "TRK-001", driver: "John Smith", liters: 150, cost: 225, location: "Dallas Station 5", time: "2 hrs ago" },
    { vehicle: "TRK-015", driver: "Mike Johnson", liters: 120, cost: 180, location: "Houston Depot", time: "4 hrs ago" },
    { vehicle: "VAN-003", driver: "David Brown", liters: 80, cost: 120, location: "Austin Terminal", time: "6 hrs ago" },
];

const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
        high: "destructive",
        medium: "default",
        low: "secondary",
    };
    return <Badge variant={variants[priority] || "outline"}>{priority.toUpperCase()}</Badge>;
};

export default function FleetPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
                <p className="text-gray-600">Monitor vehicles, maintenance, and fuel consumption</p>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {fleetStats.map((stat) => (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {fleetItems.map((item) => (
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
                                        <p className="text-xs text-muted-foreground">Scheduled</p>
                                    </div>
                                    <Badge variant="destructive">{item.badge}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}

                {/* Upcoming Maintenance Card */}
                <Card className="col-span-1 lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5" />
                            Upcoming Maintenance
                        </CardTitle>
                        <CardDescription>Scheduled maintenance tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {upcomingMaintenance.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <span className="font-medium">{item.vehicle}</span>
                                        <span className="text-muted-foreground">{item.type}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-muted-foreground">{item.due}</span>
                                        {getPriorityBadge(item.priority)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Fuel Entries */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Fuel className="h-5 w-5" />
                        Recent Fuel Entries
                    </CardTitle>
                    <CardDescription>Latest fuel consumption records</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-medium">Vehicle</th>
                                    <th className="text-left py-3 px-4 font-medium">Driver</th>
                                    <th className="text-left py-3 px-4 font-medium">Liters</th>
                                    <th className="text-left py-3 px-4 font-medium">Cost</th>
                                    <th className="text-left py-3 px-4 font-medium">Location</th>
                                    <th className="text-left py-3 px-4 font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentFuel.map((entry, idx) => (
                                    <tr key={idx} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{entry.vehicle}</td>
                                        <td className="py-3 px-4">{entry.driver}</td>
                                        <td className="py-3 px-4">{entry.liters}L</td>
                                        <td className="py-3 px-4">${entry.cost}</td>
                                        <td className="py-3 px-4">{entry.location}</td>
                                        <td className="py-3 px-4 text-muted-foreground">{entry.time}</td>
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
