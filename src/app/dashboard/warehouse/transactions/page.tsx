"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search, ArrowDownRight, ArrowUpRight, RefreshCw, AlertCircle, Package } from "lucide-react";

interface Transaction {
    id: string;
    warehouseId: string;
    warehouseName: string;
    locationCode: string;
    skuCode: string;
    skuName: string;
    transactionType: "INBOUND" | "OUTBOUND" | "TRANSFER" | "ADJUSTMENT" | "CYCLE_COUNT";
    quantity: number;
    referenceNo: string;
    referenceType: string;
    reason: string;
    createdBy: string;
    createdAt: string;
}

const mockTransactions: Transaction[] = [
    {
        id: "1",
        warehouseId: "wh1",
        warehouseName: "Dallas DC",
        locationCode: "A-01-01",
        skuCode: "SKU-001",
        skuName: "Premium Packaging Box L",
        transactionType: "INBOUND",
        quantity: 500,
        referenceNo: "GRN-2024-001",
        referenceType: "GRN",
        reason: "Purchase Order Receipt",
        createdBy: "John Smith",
        createdAt: "2024-12-09 10:30",
    },
    {
        id: "2",
        warehouseId: "wh1",
        warehouseName: "Dallas DC",
        locationCode: "B-02-03",
        skuCode: "SKU-042",
        skuName: "Bubble Wrap Roll 50m",
        transactionType: "OUTBOUND",
        quantity: -25,
        referenceNo: "ORD-2024-156",
        referenceType: "ORDER",
        reason: "Customer Order Fulfillment",
        createdBy: "Jane Doe",
        createdAt: "2024-12-09 09:15",
    },
    {
        id: "3",
        warehouseId: "wh2",
        warehouseName: "LA Fulfillment",
        locationCode: "C-01-02",
        skuCode: "SKU-089",
        skuName: "Pallet Stretch Film",
        transactionType: "TRANSFER",
        quantity: 100,
        referenceNo: "TRF-2024-023",
        referenceType: "TRANSFER",
        reason: "Inter-warehouse Transfer",
        createdBy: "Mike Johnson",
        createdAt: "2024-12-09 08:45",
    },
    {
        id: "4",
        warehouseId: "wh1",
        warehouseName: "Dallas DC",
        locationCode: "A-03-01",
        skuCode: "SKU-156",
        skuName: "Shipping Labels 4x6",
        transactionType: "ADJUSTMENT",
        quantity: -5,
        referenceNo: "ADJ-2024-012",
        referenceType: "ADJUSTMENT",
        reason: "Damaged Goods Write-off",
        createdBy: "Sarah Williams",
        createdAt: "2024-12-08 16:20",
    },
    {
        id: "5",
        warehouseId: "wh3",
        warehouseName: "Chicago Hub",
        locationCode: "D-01-01",
        skuCode: "SKU-234",
        skuName: "Corrugated Boxes Medium",
        transactionType: "CYCLE_COUNT",
        quantity: 10,
        referenceNo: "CC-2024-089",
        referenceType: "CYCLE_COUNT",
        reason: "Physical Count Variance",
        createdBy: "Tom Wilson",
        createdAt: "2024-12-08 14:00",
    },
];

const transactionTypeIcons = {
    INBOUND: ArrowDownRight,
    OUTBOUND: ArrowUpRight,
    TRANSFER: RefreshCw,
    ADJUSTMENT: AlertCircle,
    CYCLE_COUNT: Package,
};

const transactionTypeColors = {
    INBOUND: "default",
    OUTBOUND: "secondary",
    TRANSFER: "outline",
    ADJUSTMENT: "destructive",
    CYCLE_COUNT: "default",
} as const;

export default function TransactionsPage() {
    const [transactions] = useState<Transaction[]>(mockTransactions);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const filteredTransactions = transactions.filter((txn) => {
        const matchesSearch =
            txn.skuCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.skuName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.referenceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            txn.warehouseName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === "all" || txn.transactionType === typeFilter;
        return matchesSearch && matchesType;
    });

    const stats = {
        inbound: transactions.filter((t) => t.transactionType === "INBOUND").reduce((sum, t) => sum + t.quantity, 0),
        outbound: Math.abs(transactions.filter((t) => t.transactionType === "OUTBOUND").reduce((sum, t) => sum + t.quantity, 0)),
        transfers: transactions.filter((t) => t.transactionType === "TRANSFER").length,
        adjustments: transactions.filter((t) => t.transactionType === "ADJUSTMENT").length,
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Inventory Transactions</h1>
                <p className="text-gray-600">View and track all inventory movements across warehouses</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inbound Today</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">+{stats.inbound}</div>
                        <p className="text-xs text-muted-foreground">units received</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Outbound Today</CardTitle>
                        <ArrowUpRight className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">-{stats.outbound}</div>
                        <p className="text-xs text-muted-foreground">units shipped</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Transfers</CardTitle>
                        <RefreshCw className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.transfers}</div>
                        <p className="text-xs text-muted-foreground">movements</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Adjustments</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.adjustments}</div>
                        <p className="text-xs text-muted-foreground">corrections</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Transaction History</CardTitle>
                    <CardDescription>
                        Complete log of all inventory movements, adjustments, and transfers.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 flex-1">
                            <Search className="h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search by SKU, reference, or warehouse..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="max-w-sm"
                            />
                        </div>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filter by type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="INBOUND">Inbound</SelectItem>
                                <SelectItem value="OUTBOUND">Outbound</SelectItem>
                                <SelectItem value="TRANSFER">Transfer</SelectItem>
                                <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                                <SelectItem value="CYCLE_COUNT">Cycle Count</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date/Time</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Warehouse</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>SKU</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Reference</TableHead>
                                <TableHead>Created By</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((txn) => {
                                const Icon = transactionTypeIcons[txn.transactionType];
                                return (
                                    <TableRow key={txn.id}>
                                        <TableCell className="text-muted-foreground">{txn.createdAt}</TableCell>
                                        <TableCell>
                                            <Badge variant={transactionTypeColors[txn.transactionType]}>
                                                <Icon className="h-3 w-3 mr-1" />
                                                {txn.transactionType.replace("_", " ")}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{txn.warehouseName}</TableCell>
                                        <TableCell className="font-mono text-xs">{txn.locationCode}</TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-medium">{txn.skuCode}</div>
                                                <div className="text-xs text-muted-foreground truncate max-w-[150px]">{txn.skuName}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={txn.quantity >= 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                                {txn.quantity >= 0 ? "+" : ""}{txn.quantity}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="font-mono text-xs">{txn.referenceNo}</div>
                                                <div className="text-xs text-muted-foreground">{txn.reason}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{txn.createdBy}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
