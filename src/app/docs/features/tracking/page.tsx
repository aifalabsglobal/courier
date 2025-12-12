import Link from "next/link";

export default function TrackingFeaturePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Tracking & Monitoring</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Tracking & Monitoring</h1>
            <p className="text-lg text-gray-600 mb-8">Track shipments in real-time with detailed event history.</p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Public Tracking Page</h2>
                <p className="text-gray-600 mb-4">
                    Customers can track their shipments at <code className="bg-gray-100 px-2 py-1 rounded">/track</code>
                </p>
                <p className="text-gray-600 mb-8">
                    Enter an order number (e.g., ORD-2024-0001) to see tracking details.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Event Types</h2>
                <div className="space-y-2 mb-8">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg"><strong>DISPATCHED</strong> - Vehicle dispatched</div>
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg"><strong>DEPARTED</strong> - Left origin/checkpoint</div>
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg"><strong>ARRIVED</strong> - Reached checkpoint</div>
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg"><strong>DELAYED</strong> - Delay reported</div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg"><strong>DELIVERED</strong> - Shipment delivered</div>
                </div>
            </div>
        </div>
    );
}
