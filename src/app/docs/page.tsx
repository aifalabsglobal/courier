import Link from "next/link";
import { ArrowRight, Package, Truck, Warehouse, FileText, Users, MapPin } from "lucide-react";

export default function DocsHomePage() {
    return (
        <div>
            {/* Hero */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Courier Documentation</h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                    Welcome to the Courier TMS documentation. Learn how to manage your transportation,
                    warehouse, fleet, and billing operations efficiently.
                </p>
            </div>

            {/* Quick Start */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-10 border border-blue-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Quick Start</h2>
                <p className="text-gray-600 mb-4">New to Courier? Start here to get up and running in minutes.</p>
                <Link href="/docs/getting-started" className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700">
                    Get Started <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Module Cards */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore Modules</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-10">
                <ModuleCard
                    icon={<Package className="w-6 h-6 text-blue-600" />}
                    title="Orders Management"
                    description="Create, track, and manage customer orders through their lifecycle."
                    href="/docs/modules/orders"
                />
                <ModuleCard
                    icon={<Truck className="w-6 h-6 text-green-600" />}
                    title="Fleet Management"
                    description="Manage vehicles, drivers, maintenance schedules, and fuel consumption."
                    href="/docs/modules/fleet"
                />
                <ModuleCard
                    icon={<Warehouse className="w-6 h-6 text-orange-600" />}
                    title="Warehouse Management"
                    description="Handle inventory, storage locations, and stock movements."
                    href="/docs/modules/warehouse"
                />
                <ModuleCard
                    icon={<FileText className="w-6 h-6 text-purple-600" />}
                    title="Billing & Invoicing"
                    description="Generate invoices, manage tariffs, and track payments."
                    href="/docs/modules/billing"
                />
                <ModuleCard
                    icon={<MapPin className="w-6 h-6 text-red-600" />}
                    title="Transportation"
                    description="Plan routes, schedule trips, and track shipments in real-time."
                    href="/docs/modules/transportation"
                />
                <ModuleCard
                    icon={<Users className="w-6 h-6 text-indigo-600" />}
                    title="Master Data"
                    description="Manage customers, vendors, locations, and other reference data."
                    href="/docs/modules/master-data"
                />
            </div>

            {/* Additional Resources */}
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Resources</h2>
            <div className="grid md:grid-cols-3 gap-4">
                <ResourceCard title="API Reference" description="Integrate with Courier using our REST APIs." href="/docs/api/authentication" />
                <ResourceCard title="User Management" description="Configure roles, permissions, and access." href="/docs/features/users" />
                <ResourceCard title="Tracking" description="Real-time shipment tracking features." href="/docs/features/tracking" />
            </div>
        </div>
    );
}

function ModuleCard({ icon, title, description, href }: { icon: React.ReactNode; title: string; description: string; href: string }) {
    return (
        <Link href={href} className="group block p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">{icon}</div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </Link>
    );
}

function ResourceCard({ title, description, href }: { title: string; description: string; href: string }) {
    return (
        <Link href={href} className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all">
            <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
        </Link>
    );
}
