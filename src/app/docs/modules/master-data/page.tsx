import Link from "next/link";

export default function MasterDataModulePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Master Data</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Master Data</h1>
            <p className="text-lg text-gray-600 mb-8">
                Manage your foundational reference data: customers, vendors, locations, drivers, and vehicles.
            </p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Customers</h2>
                <p className="text-gray-600 mb-4">Your customer database includes:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Company name and contact information</li>
                    <li>Billing address and payment terms</li>
                    <li>Credit limit settings</li>
                    <li>Active/Inactive status</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Vendors</h2>
                <p className="text-gray-600 mb-4">Manage external carriers and service providers:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Company details and contact info</li>
                    <li>Service types offered (FTL, LTL, etc.)</li>
                    <li>Contract and rate information</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Locations</h2>
                <p className="text-gray-600 mb-4">Define physical locations for operations:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Warehouses and distribution centers</li>
                    <li>Pickup and delivery points</li>
                    <li>GPS coordinates for mapping</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Drivers</h2>
                <p className="text-gray-600 mb-4">Driver profiles with:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Personal and contact details</li>
                    <li>License information and expiry</li>
                    <li>Performance ratings</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Vehicles</h2>
                <p className="text-gray-600 mb-4">Fleet vehicle records with:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Registration and vehicle type</li>
                    <li>Capacity specifications</li>
                    <li>Document expiry tracking</li>
                </ul>
            </div>
        </div>
    );
}
