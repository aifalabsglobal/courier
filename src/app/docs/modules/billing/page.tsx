import Link from "next/link";

export default function BillingModulePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <Link href="/docs" className="hover:text-blue-600">Modules</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Billing & Invoicing</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Billing & Invoicing</h1>
            <p className="text-lg text-gray-600 mb-8">
                Generate invoices, manage tariffs, and track payments for your transportation services.
            </p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Invoices</h2>
                <p className="text-gray-600 mb-4">Create and manage invoices with these statuses:</p>
                <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">DRAFT</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">SENT</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">PAID</span>
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">OVERDUE</span>
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">PARTIAL</span>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Tariffs</h2>
                <p className="text-gray-600 mb-4">Define pricing rules for your services:</p>
                <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Weight-Based</h3>
                        <p className="text-sm text-gray-600">Price calculated based on shipment weight (per kg or weight slabs)</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Zone-Based</h3>
                        <p className="text-sm text-gray-600">Fixed rates based on origin/destination zones</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Lane-Based</h3>
                        <p className="text-sm text-gray-600">Specific rates for defined origin-destination pairs</p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Reports</h2>
                <p className="text-gray-600 mb-4">Access financial reports including:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li><strong>Revenue Report</strong> - Monthly and yearly revenue summaries</li>
                    <li><strong>Collection Report</strong> - Payment collection status</li>
                    <li><strong>Aging Report</strong> - Outstanding invoices by age</li>
                    <li><strong>Customer Statement</strong> - Per-customer billing history</li>
                </ul>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm text-green-800">
                        <strong>Tip:</strong> Set up payment terms for each customer to automatically calculate invoice due dates.
                    </p>
                </div>
            </div>
        </div>
    );
}
