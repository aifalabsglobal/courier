import Link from "next/link";

export default function FleetModulePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <Link href="/docs" className="hover:text-blue-600">Modules</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Fleet Management</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Fleet Management</h1>
            <p className="text-lg text-gray-600 mb-8">
                Manage your vehicles, drivers, maintenance schedules, and fuel consumption all in one place.
            </p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Vehicles</h2>
                <p className="text-gray-600 mb-4">
                    Register and manage your fleet of vehicles. Each vehicle record includes:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Registration number and vehicle identification</li>
                    <li>Make, model, and year of manufacture</li>
                    <li>Capacity (weight and pallet count)</li>
                    <li>Fuel type (Diesel, Petrol, CNG, Electric)</li>
                    <li>Fitness and insurance expiry dates</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Drivers</h2>
                <p className="text-gray-600 mb-4">
                    Maintain a database of your drivers with essential information:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Personal and contact details</li>
                    <li>License number and expiry date</li>
                    <li>Performance rating</li>
                    <li>Assignment history</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Maintenance</h2>
                <p className="text-gray-600 mb-4">
                    Track all maintenance activities to keep your fleet running efficiently:
                </p>
                <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Preventive Maintenance</h3>
                        <p className="text-sm text-gray-600">Scheduled services like oil changes, tire rotations, and inspections.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Corrective Maintenance</h3>
                        <p className="text-sm text-gray-600">Repairs for identified issues like brake replacements or engine repairs.</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Emergency Maintenance</h3>
                        <p className="text-sm text-gray-600">Urgent repairs required due to breakdowns or accidents.</p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Fuel Management</h2>
                <p className="text-gray-600 mb-4">
                    Log fuel consumption to monitor costs and efficiency:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li>Record fuel quantity and cost per fill-up</li>
                    <li>Track odometer readings</li>
                    <li>Calculate fuel efficiency (km/L)</li>
                    <li>Identify high-consumption vehicles</li>
                </ul>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        <strong>Reminder:</strong> Regularly update vehicle fitness and insurance expiry dates to receive alerts before documents expire.
                    </p>
                </div>
            </div>
        </div>
    );
}
