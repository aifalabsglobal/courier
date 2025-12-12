"use client";

import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

interface Order {
    id: string;
    orderNo: string;
    orderType: string;
    status: string;
    priority: string;
    shipperName?: string;
    shipperAddress?: string;
    shipperCity?: string;
    shipperState?: string;
    shipperPhone?: string;
    consigneeName?: string;
    consigneeAddress?: string;
    consigneeCity?: string;
    consigneeState?: string;
    consigneePhone?: string;
    totalWeight?: number;
    packageCount?: number;
    description?: string;
    specialHandling?: string;
    createdAt: string;
    customer?: { name: string; phone?: string; };
}

// Simple barcode generator using CSS
function Barcode({ value }: { value: string }) {
    // Create a pattern from the string
    const pattern = value.split('').map((char, i) => {
        const code = char.charCodeAt(0);
        return (code + i) % 2 === 0 ? 'w' : 'n'; // wide or narrow
    });

    return (
        <div className="flex items-end justify-center h-16 gap-[1px]">
            {pattern.map((type, i) => (
                <div key={i} className={`bg-black ${type === 'w' ? 'w-[3px]' : 'w-[1px]'} h-full`} />
            ))}
            {/* Add quiet zone bars */}
            {[...Array(10)].map((_, i) => (
                <div key={`end-${i}`} className={`bg-black ${i % 2 === 0 ? 'w-[2px]' : 'w-[1px]'} h-full`} />
            ))}
        </div>
    );
}

function WaybillCopy({ order, copyType, showCutLine = true }: { order: Order; copyType: string; showCutLine?: boolean }) {
    const copyColors: Record<string, string> = {
        'SHIPPER COPY': 'border-blue-500 bg-blue-50',
        'CONSIGNEE COPY': 'border-green-500 bg-green-50',
        'CARRIER COPY': 'border-yellow-500 bg-yellow-50',
    };

    return (
        <div className={`border-2 ${copyColors[copyType] || 'border-gray-400'} p-4 mb-2 print:break-inside-avoid`}>
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-black pb-3 mb-3">
                <div>
                    <h1 className="text-2xl font-bold">SWIFT LOGISTICS</h1>
                    <p className="text-sm text-gray-600">123 Logistics Way, New York, NY 10001</p>
                    <p className="text-sm text-gray-600">Tel: +1-555-0100 | www.swiftlogistics.com</p>
                </div>
                <div className="text-right">
                    <div className={`inline-block px-3 py-1 text-sm font-bold border-2 ${copyColors[copyType]?.replace('bg-', 'border-').replace('50', '500') || 'border-gray-500'}`}>
                        {copyType}
                    </div>
                    <div className="mt-2">
                        <Barcode value={order.orderNo} />
                        <p className="text-center font-mono text-sm mt-1">{order.orderNo}</p>
                    </div>
                </div>
            </div>

            {/* Waybill Info */}
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                <div className="border border-gray-300 p-2">
                    <p className="text-xs text-gray-500 uppercase">Waybill No.</p>
                    <p className="font-bold text-lg">{order.orderNo}</p>
                </div>
                <div className="border border-gray-300 p-2">
                    <p className="text-xs text-gray-500 uppercase">Date</p>
                    <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="border border-gray-300 p-2">
                    <p className="text-xs text-gray-500 uppercase">Service Type</p>
                    <p className="font-bold">{order.orderType} - {order.priority}</p>
                </div>
            </div>

            {/* Shipper & Consignee */}
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="border-2 border-gray-400 p-3">
                    <div className="bg-gray-200 -m-3 mb-2 p-2">
                        <h3 className="font-bold text-sm uppercase">Shipper / Sender</h3>
                    </div>
                    <div className="text-sm space-y-1 mt-4">
                        <p className="font-bold">{order.shipperName || order.customer?.name || 'N/A'}</p>
                        <p>{order.shipperAddress || 'Address not provided'}</p>
                        <p>{order.shipperCity}, {order.shipperState}</p>
                        <p>Tel: {order.shipperPhone || order.customer?.phone || 'N/A'}</p>
                    </div>
                </div>
                <div className="border-2 border-gray-400 p-3">
                    <div className="bg-gray-200 -m-3 mb-2 p-2">
                        <h3 className="font-bold text-sm uppercase">Consignee / Receiver</h3>
                    </div>
                    <div className="text-sm space-y-1 mt-4">
                        <p className="font-bold">{order.consigneeName || 'N/A'}</p>
                        <p>{order.consigneeAddress || 'Address not provided'}</p>
                        <p>{order.consigneeCity}, {order.consigneeState}</p>
                        <p>Tel: {order.consigneePhone || 'N/A'}</p>
                    </div>
                </div>
            </div>

            {/* Package Details */}
            <div className="border-2 border-gray-400 mb-4">
                <div className="bg-gray-200 p-2">
                    <h3 className="font-bold text-sm uppercase">Package Details</h3>
                </div>
                <div className="p-3">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-1">Description</th>
                                <th className="text-center py-1">Packages</th>
                                <th className="text-center py-1">Weight (kg)</th>
                                <th className="text-left py-1">Special Handling</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2">{order.description || 'General cargo'}</td>
                                <td className="text-center py-2 font-bold">{order.packageCount || 1}</td>
                                <td className="text-center py-2 font-bold">{order.totalWeight || 0}</td>
                                <td className="py-2">{order.specialHandling?.replace(/[\[\]"]/g, '') || 'None'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="border border-gray-300 p-2">
                    <p className="text-xs text-gray-500 uppercase mb-8">Shipper Signature</p>
                    <div className="border-t border-gray-400 pt-1">
                        <p className="text-xs text-gray-500">Date: _______________</p>
                    </div>
                </div>
                <div className="border border-gray-300 p-2">
                    <p className="text-xs text-gray-500 uppercase mb-8">Driver Signature</p>
                    <div className="border-t border-gray-400 pt-1">
                        <p className="text-xs text-gray-500">Date: _______________</p>
                    </div>
                </div>
                <div className="border border-gray-300 p-2">
                    <p className="text-xs text-gray-500 uppercase mb-8">Receiver Signature</p>
                    <div className="border-t border-gray-400 pt-1">
                        <p className="text-xs text-gray-500">Date: _______________</p>
                    </div>
                </div>
            </div>

            {/* Cut line */}
            {showCutLine && (
                <div className="mt-4 border-t-2 border-dashed border-gray-400 pt-2 text-center text-xs text-gray-400 print:block">
                    ✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - CUT HERE - - - - - - - - - - - - - - - - - - - - - - - - - - - - ✂
                </div>
            )}
        </div>
    );
}

export default function WaybillPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await fetch(`/api/orders/${id}`);
                if (res.ok) setOrder(await res.json());
            } catch (error) {
                console.error("Failed to fetch order", error);
            }
            setIsLoading(false);
        };
        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-xl">Order not found</p>
                <Link href="/dashboard/orders">
                    <Button><ArrowLeft className="h-4 w-4 mr-2" />Back to Orders</Button>
                </Link>
            </div>
        );
    }

    return (
        <>
            {/* Print Styles */}
            <style jsx global>{`
                @media print {
                    body * { visibility: hidden; }
                    .print-area, .print-area * { visibility: visible; }
                    .print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    .no-print { display: none !important; }
                    @page { size: A4; margin: 10mm; }
                }
            `}</style>

            {/* Controls - Hidden when printing */}
            <div className="no-print bg-white border-b p-4 sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/orders">
                        <Button variant="outline" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Back</Button>
                    </Link>
                    <h1 className="text-xl font-bold">Waybill: {order.orderNo}</h1>
                </div>
                <Button onClick={handlePrint}><Printer className="h-4 w-4 mr-2" />Print Waybill</Button>
            </div>

            {/* Printable Area */}
            <div className="print-area bg-white p-4 max-w-4xl mx-auto">
                <WaybillCopy order={order} copyType="SHIPPER COPY" />
                <WaybillCopy order={order} copyType="CONSIGNEE COPY" />
                <WaybillCopy order={order} copyType="CARRIER COPY" showCutLine={false} />
            </div>
        </>
    );
}
