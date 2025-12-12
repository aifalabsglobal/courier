import Link from "next/link";

export default function WaybillFeaturePage() {
    return (
        <div>
            <nav className="text-sm text-gray-500 mb-4">
                <Link href="/docs" className="hover:text-blue-600">Docs</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">Waybill Generation</span>
            </nav>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">Waybill Generation</h1>
            <p className="text-lg text-gray-600 mb-8">Generate printable waybills with barcodes for your shipments.</p>

            <div className="prose prose-gray max-w-none">
                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Waybill Contents</h2>
                <ul className="list-disc list-inside space-y-1 text-gray-600 mb-8">
                    <li><strong>Barcode</strong> - Scannable code for order tracking</li>
                    <li><strong>Shipper Details</strong> - Origin name, address, contact</li>
                    <li><strong>Consignee Details</strong> - Destination name, address, contact</li>
                    <li><strong>Package Info</strong> - Weight, count, special handling</li>
                    <li><strong>Signature Blocks</strong> - For shipper, driver, receiver</li>
                </ul>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Copies</h2>
                <div className="space-y-2 mb-8">
                    <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg"><strong>Shipper Copy</strong> - Kept by sender</div>
                    <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg"><strong>Consignee Copy</strong> - Given to receiver</div>
                    <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-r-lg"><strong>Carrier Copy</strong> - Carrier&apos;s record</div>
                </div>

                <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How to Print</h2>
                <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-8">
                    <li>Go to <strong>Orders</strong> page</li>
                    <li>Click the <strong>printer icon</strong> next to an order</li>
                    <li>Click <strong>Print Waybill</strong> button</li>
                    <li>Use browser print dialog (Ctrl+P)</li>
                </ol>
            </div>
        </div>
    );
}
