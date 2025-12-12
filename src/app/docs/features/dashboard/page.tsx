import Link from "next/link";

export default function DashboardFeaturePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Dashboard Analytics</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dashboard Analytics</h1>
            <p className="text-lg text-gray-600 mb-8">Overview of key metrics and analytics available on the dashboard.</p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Key Metrics</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li><strong>Total Revenue</strong> - Sum of all invoiced amounts</li>
                    <li><strong>Active Orders</strong> - Orders currently in progress</li>
                    <li><strong>Fleet Utilization</strong> - Percentage of vehicles in use</li>
                    <li><strong>On-Time Delivery</strong> - Delivery performance rate</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Charts & Visualizations</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Revenue trend over time</li>
                    <li>Order status distribution</li>
                    <li>Top customers by volume</li>
                    <li>Route performance</li>
                </ul>
            </div>
        </div>
    );
}
