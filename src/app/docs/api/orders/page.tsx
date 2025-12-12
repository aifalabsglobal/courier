import Link from "next/link";

export default function OrdersAPIPage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <Link href="/docs/api/authentication" className="hover:text-blue-600">API</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Orders API</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Orders API</h1>
            <p className="text-lg text-gray-600 mb-8">Endpoints for managing orders.</p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">List Orders</h2>
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 font-mono text-sm rounded">GET</span>
                    <code className="text-gray-900">/api/orders</code>
                </div>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-8 overflow-x-auto">
                    <pre className="text-sm"><code>{`// Response
[
  {
    "id": "clxxx...",
    "orderNo": "ORD-2024-0001",
    "status": "IN_TRANSIT",
    "priority": "HIGH",
    "customer": { "name": "Acme Corp" }
  }
]`}</code></pre>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Create Order</h2>
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 font-mono text-sm rounded">POST</span>
                    <code className="text-gray-900">/api/orders</code>
                </div>
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-8 overflow-x-auto">
                    <pre className="text-sm"><code>{`// Request Body
{
  "customerId": "clxxx...",
  "orderType": "FTL",
  "priority": "HIGH",
  "shipperCity": "New York",
  "consigneeCity": "Los Angeles",
  "totalWeight": 1500,
  "packageCount": 10
}`}</code></pre>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Get Order</h2>
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 font-mono text-sm rounded">GET</span>
                    <code className="text-gray-900">/api/orders/:id</code>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Update Order</h2>
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 font-mono text-sm rounded">PUT</span>
                    <code className="text-gray-900">/api/orders/:id</code>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Delete Order</h2>
                <div className="flex items-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-red-100 text-red-700 font-mono text-sm rounded">DELETE</span>
                    <code className="text-gray-900">/api/orders/:id</code>
                </div>
            </div>
        </div>
    );
}
