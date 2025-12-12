import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function GettingStartedPage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Getting Started</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Getting Started with Courier TMS</h1>
            <p className="text-lg text-gray-600 mb-8">
                This guide will walk you through the basics of setting up and using Courier Transportation Management System.
            </p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Prerequisites</h2>
                <ul className="space-y-2 mb-8">
                    <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span>A modern web browser (Chrome, Firefox, Safari, Edge)</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span>Active user account with appropriate permissions</span></li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-5 h-5 text-green-500 mt-0.5 shrink-0" /><span>Basic understanding of logistics and transportation operations</span></li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 1: Access the Dashboard</h2>
                <p className="text-gray-600 mb-4">
                    After logging in, you&apos;ll be directed to the main dashboard. The dashboard provides an overview of:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
                    <li>Active orders and their current status</li>
                    <li>Fleet utilization and availability</li>
                    <li>Revenue and billing summaries</li>
                    <li>Recent activities and alerts</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> Use the sidebar navigation to access different modules. The sidebar is collapsible for a cleaner view.
                    </p>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 2: Set Up Master Data</h2>
                <p className="text-gray-600 mb-4">
                    Before creating orders, you need to set up your master data:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-8">
                    <li><strong>Customers</strong> - Add your customer database with contact and billing details</li>
                    <li><strong>Vehicles</strong> - Register your fleet with capacity and documentation info</li>
                    <li><strong>Drivers</strong> - Add driver profiles with license and contact information</li>
                    <li><strong>Locations</strong> - Define warehouse, depot, and delivery point locations</li>
                </ol>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 3: Create Your First Order</h2>
                <p className="text-gray-600 mb-4">
                    Navigate to <strong>Orders</strong> and click <strong>New Order</strong> to create a shipment:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-8">
                    <li>Select a customer from your database</li>
                    <li>Enter shipper and consignee details</li>
                    <li>Specify package count, weight, and dimensions</li>
                    <li>Choose service type (FTL, LTL, or Parcel)</li>
                    <li>Set pickup and delivery dates</li>
                    <li>Save and confirm the order</li>
                </ol>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Step 4: Dispatch and Track</h2>
                <p className="text-gray-600 mb-4">
                    Once orders are confirmed, you can:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Assign vehicles and drivers to trips</li>
                    <li>Generate waybills for documentation</li>
                    <li>Track shipments in real-time</li>
                    <li>Update status as shipments progress</li>
                </ul>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mt-10">
                    <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
                    <p className="text-gray-600 mb-4">Ready to dive deeper? Explore our module guides:</p>
                    <div className="flex flex-wrap gap-4">
                        <Link href="/docs/modules/orders" className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700">Orders <ArrowRight className="w-4 h-4" /></Link>
                        <Link href="/docs/modules/fleet" className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700">Fleet <ArrowRight className="w-4 h-4" /></Link>
                        <Link href="/docs/modules/warehouse" className="inline-flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700">Warehouse <ArrowRight className="w-4 h-4" /></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
