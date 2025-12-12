import Link from "next/link";

export default function UsersFeaturePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">User Management</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">User Management</h1>
            <p className="text-lg text-gray-600 mb-8">Manage users, roles, and permissions.</p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Roles</h2>
                <div className="space-y-4 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Administrator</h3>
                        <p className="text-sm text-gray-600">Full access to all modules and settings</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">User</h3>
                        <p className="text-sm text-gray-600">Standard access with read/write to assigned modules</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <h3 className="font-semibold text-gray-900">Driver</h3>
                        <p className="text-sm text-gray-600">Limited access for mobile driver operations</p>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Adding Users</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-8">
                    <li>Navigate to <strong>Users</strong> in the sidebar</li>
                    <li>Click <strong>Add User</strong></li>
                    <li>Enter email, name, and select a role</li>
                    <li>Click <strong>Create</strong></li>
                </ol>
            </div>
        </div>
    );
}
