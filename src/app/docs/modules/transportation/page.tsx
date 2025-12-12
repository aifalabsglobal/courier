import Link from "next/link";

export default function TransportationModulePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Transportation</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Transportation</h1>
            <p className="text-lg text-gray-600 mb-8">
                Plan routes, schedule trips, and track shipments in real-time.
            </p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Routes</h2>
                <p className="text-gray-600 mb-4">Define your commonly used routes with:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Origin and destination points</li>
                    <li>Total distance in kilometers</li>
                    <li>Estimated transit hours</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Trips</h2>
                <p className="text-gray-600 mb-4">A trip represents a vehicle journey with:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Assigned vehicle and driver</li>
                    <li>Origin and destination</li>
                    <li>Planned departure and arrival times</li>
                    <li>Associated orders</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Trip Status</h2>
                <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">PLANNED</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">DISPATCHED</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">IN_TRANSIT</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">COMPLETED</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">CANCELLED</span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Tracking</h2>
                <p className="text-gray-600 mb-4">Track shipment progress with real-time events:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li><strong>Departed</strong> - Vehicle left origin</li>
                    <li><strong>Arrived</strong> - Vehicle reached checkpoint</li>
                    <li><strong>Delayed</strong> - Issues causing delay</li>
                    <li><strong>Delivered</strong> - Shipment delivered</li>
                </ul>
            </div>
        </div>
    );
}
