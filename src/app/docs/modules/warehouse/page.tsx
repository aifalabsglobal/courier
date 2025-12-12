import Link from "next/link";

export default function WarehouseModulePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <Link href="/docs" className="hover:text-blue-600">Modules</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Warehouse Management</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Warehouse Management</h1>
            <p className="text-lg text-gray-600 mb-8">
                Manage your warehouses, storage locations, inventory levels, and stock movements.
            </p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Warehouses</h2>
                <p className="text-gray-600 mb-4">Define your warehouse facilities with types:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li><strong>Distribution Center</strong> - Large facilities for receiving and shipping goods</li>
                    <li><strong>Fulfillment Center</strong> - Focused on order picking and packing</li>
                    <li><strong>Cross-Dock</strong> - Minimal storage, direct transfer between trailers</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Locations</h2>
                <p className="text-gray-600 mb-4">Organize storage using location codes:</p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-8 font-mono text-sm">
                    <p><strong>Format:</strong> ZONE-AISLE-RACK-LEVEL</p>
                    <p>Example: A-01-03-2 = Zone A, Aisle 01, Rack 03, Level 2</p>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Inventory</h2>
                <p className="text-gray-600 mb-4">Track stock levels with:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li><strong>Total Quantity</strong> - Physical count in location</li>
                    <li><strong>Available Quantity</strong> - Stock available for allocation</li>
                    <li><strong>Reserved Quantity</strong> - Stock allocated to orders</li>
                    <li><strong>Batch Number</strong> - For tracking specific lots</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Transactions</h2>
                <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="font-semibold text-green-700">INBOUND</span>
                        <span className="text-sm text-gray-600">Receiving goods into inventory</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="font-semibold text-red-700">OUTBOUND</span>
                        <span className="text-sm text-gray-600">Shipping goods out of inventory</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <span className="font-semibold text-blue-700">TRANSFER</span>
                        <span className="text-sm text-gray-600">Moving stock between warehouses</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <span className="font-semibold text-yellow-700">ADJUSTMENT</span>
                        <span className="text-sm text-gray-600">Correcting inventory counts</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
