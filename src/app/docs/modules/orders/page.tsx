import Link from "next/link";

export default function OrdersModulePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <Link href="/docs" className="hover:text-blue-600">Modules</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Orders Management</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Orders Management</h1>
            <p className="text-lg text-gray-600 mb-8">
                The Orders module is the core of Courier TMS. It allows you to create, track, and manage all customer orders throughout their lifecycle.
            </p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Overview</h2>
                <p className="text-gray-600 mb-4">
                    Orders in Courier represent shipment requests from customers. Each order contains information about the shipper, consignee, cargo details, and delivery requirements.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Order Types</h2>
                <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">FTL (Full Truck Load)</h3>
                        <p className="text-sm text-gray-600">Dedicated truck for a single shipment. Best for large cargo volumes.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">LTL (Less Than Truckload)</h3>
                        <p className="text-sm text-gray-600">Shared truck space with other shipments. Cost-effective for smaller loads.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Parcel</h3>
                        <p className="text-sm text-gray-600">Individual packages for small shipments.</p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Order Status Flow</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">DRAFT</span>
                    <span className="text-gray-400">→</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">CONFIRMED</span>
                    <span className="text-gray-400">→</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">DISPATCHED</span>
                    <span className="text-gray-400">→</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">IN_TRANSIT</span>
                    <span className="text-gray-400">→</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">DELIVERED</span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Creating an Order</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-8">
                    <li>Navigate to <strong>Orders</strong> from the sidebar</li>
                    <li>Click the <strong>New Order</strong> button</li>
                    <li>Select a customer from the dropdown</li>
                    <li>Choose the order type (FTL, LTL, or Parcel)</li>
                    <li>Enter origin city and destination city</li>
                    <li>Specify weight and package count</li>
                    <li>Click <strong>Create</strong> to save</li>
                </ol>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Waybill Generation</h2>
                <p className="text-gray-600 mb-4">
                    Each order can generate a waybill document for printing. The waybill includes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Barcode for scanning and tracking</li>
                    <li>Shipper and consignee details</li>
                    <li>Package information and weight</li>
                    <li>Signature blocks for proof of delivery</li>
                    <li>Three copies: Shipper, Consignee, and Carrier</li>
                </ul>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                        <strong>Access Waybill:</strong> Click the printer icon next to any order in the orders list to open the waybill page.
                    </p>
                </div>
            </div>
        </div>
    );
}
