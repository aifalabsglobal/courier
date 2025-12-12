import Link from "next/link";

export default function APIAuthenticationPage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <Link href="/docs" className="hover:text-blue-600">API Reference</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Authentication</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">API Authentication</h1>
            <p className="text-lg text-gray-600 mb-8">
                Learn how to authenticate with the Courier API using Clerk.
            </p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Overview</h2>
                <p className="text-gray-600 mb-4">
                    Courier uses <strong>Clerk</strong> for authentication. All API endpoints require a valid session token.
                </p>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Making Authenticated Requests</h2>
                <p className="text-gray-600 mb-4">
                    When making requests from the frontend, the session cookie is automatically included. For server-side or external requests, include the authorization header:
                </p>

                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-8 overflow-x-auto">
                    <pre className="text-sm"><code>{`curl -X GET https://your-app.com/api/orders \\
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"`}</code></pre>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Response Codes</h2>
                <div className="space-y-2 mb-8">
                    <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <span className="font-mono text-green-700">200</span>
                        <span className="text-sm text-gray-600">Success - Request processed</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <span className="font-mono text-red-700">401</span>
                        <span className="text-sm text-gray-600">Unauthorized - Invalid or missing token</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <span className="font-mono text-yellow-700">400</span>
                        <span className="text-sm text-gray-600">Bad Request - Invalid parameters</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <span className="font-mono text-gray-700">500</span>
                        <span className="text-sm text-gray-600">Internal Error - Server issue</span>
                    </div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Available Endpoints</h2>
                <div className="space-y-2 mb-8">
                    <Link href="/docs/api/orders" className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300">
                        <span className="font-mono text-blue-600">/api/orders</span>
                    </Link>
                    <Link href="/docs/api/customers" className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300">
                        <span className="font-mono text-blue-600">/api/customers</span>
                    </Link>
                    <Link href="/docs/api/vehicles" className="block p-3 border border-gray-200 rounded-lg hover:border-blue-300">
                        <span className="font-mono text-blue-600">/api/vehicles</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
