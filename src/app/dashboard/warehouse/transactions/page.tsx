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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Search, ArrowDownRight, ArrowUpRight, RefreshCw, AlertCircle, Package, Plus, Edit, Trash2, Eye, Loader2, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    const { toast } = useToast();
    const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(false);

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [formData, setFormData] = useState({
        warehouseName: "",
        locationCode: "",
        skuCode: "",
        skuName: "",
        transactionType: "INBOUND" as Transaction['transactionType'],
        quantity: 0,
        referenceNo: "",
        reason: "",
        createdBy: "Current User",
    });

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

    const resetForm = () => {
        setFormData({
            warehouseName: "",
            locationCode: "",
            skuCode: "",
            skuName: "",
            transactionType: "INBOUND",
            quantity: 0,
            referenceNo: "",
            reason: "",
            createdBy: "Current User",
        });
    };

    const handleCreate = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const newTransaction: Transaction = {
            id: Date.now().toString(),
            warehouseId: "wh-new",
            warehouseName: formData.warehouseName,
            locationCode: formData.locationCode,
            skuCode: formData.skuCode,
            skuName: formData.skuName,
            transactionType: formData.transactionType,
            quantity: formData.quantity,
            referenceNo: formData.referenceNo,
            referenceType: formData.transactionType,
            reason: formData.reason,
            createdBy: formData.createdBy,
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        };

        setTransactions([newTransaction, ...transactions]);
        setIsCreateDialogOpen(false);
        resetForm();
        setIsLoading(false);
        toast({ title: "Transaction Successful", description: "Inventory movement recorded." });
    };

    const handleEdit = (txn: Transaction) => {
        setSelectedTransaction(txn);
        setFormData({
            warehouseName: txn.warehouseName,
            locationCode: txn.locationCode,
            skuCode: txn.skuCode,
            skuName: txn.skuName,
            transactionType: txn.transactionType,
            quantity: txn.quantity,
            referenceNo: txn.referenceNo,
            reason: txn.reason,
            createdBy: txn.createdBy,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedTransaction) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setTransactions(transactions.map(t =>
            t.id === selectedTransaction.id
                ? { ...t, ...formData }
                : t
        ));
        setIsEditDialogOpen(false);
        setSelectedTransaction(null);
        setIsLoading(false);
        toast({ title: "Transaction Updated", description: "Record corrected successfully." });
    };

    const handleView = (txn: Transaction) => {
        setSelectedTransaction(txn);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (txn: Transaction) => {
        setSelectedTransaction(txn);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedTransaction) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setTransactions(transactions.filter(t => t.id !== selectedTransaction.id));
        setIsDeleteDialogOpen(false);
        setSelectedTransaction(null);
        setIsLoading(false);
        toast({ title: "Transaction Voided", description: "Record removed from history.", variant: "destructive" });
    };

    const TransactionForm = () => (
        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto px-1">
            <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                    <Label>Transaction Type</Label>
                    <Select
                        value={formData.transactionType}
                        onValueChange={(val: any) => setFormData({ ...formData, transactionType: val })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="INBOUND">Inbound</SelectItem>
                            <SelectItem value="OUTBOUND">Outbound</SelectItem>
                            <SelectItem value="TRANSFER">Transfer</SelectItem>
                            <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                            <SelectItem value="CYCLE_COUNT">Cycle Count</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="grid items-center gap-2">
                    <Label>Reference No</Label>
                    <Input value={formData.referenceNo} onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })} placeholder="PO-123 / ORD-456" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                    <Label>Warehouse</Label>
                    <Input value={formData.warehouseName} onChange={(e) => setFormData({ ...formData, warehouseName: e.target.value })} placeholder="Main Warehouse" />
                </div>
                <div className="grid items-center gap-2">
                    <Label>Location Code</Label>
                    <Input value={formData.locationCode} onChange={(e) => setFormData({ ...formData, locationCode: e.target.value })} placeholder="A-01-01" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                    <Label>SKU Code</Label>
                    <Input value={formData.skuCode} onChange={(e) => setFormData({ ...formData, skuCode: e.target.value })} placeholder="SKU-001" />
                </div>
                <div className="grid items-center gap-2">
                    <Label>SKU Name</Label>
                    <Input value={formData.skuName} onChange={(e) => setFormData({ ...formData, skuName: e.target.value })} placeholder="Product Name" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                    <Label>Quantity</Label>
                    <Input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} />
                </div>
                <div className="grid items-center gap-2">
                    <Label>Reason</Label>
                    <Input value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} placeholder="Reason for movement" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Inventory Transactions</h1>
                    <p className="text-gray-600">View and track all inventory movements across warehouses</p>
                </div>
                <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />
                    Record Transaction
                </Button>
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
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredTransactions.map((txn) => {
                                const Icon = transactionTypeIcons[txn.transactionType];
                                return (
                                    <TableRow key={txn.id}>
                                        <TableCell className="text-muted-foreground text-xs whitespace-nowrap">{txn.createdAt}</TableCell>
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
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Button variant="ghost" size="sm" onClick={() => handleView(txn)}><Eye className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(txn)}><Edit className="h-4 w-4" /></Button>
                                                <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(txn)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Record Transaction</DialogTitle>
                        <DialogDescription>Manually record an inventory movement.</DialogDescription>
                    </DialogHeader>
                    <TransactionForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Transaction</DialogTitle>
                        <DialogDescription>Correction of transaction details.</DialogDescription>
                    </DialogHeader>
                    <TransactionForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Correction
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                        <DialogDescription>{selectedTransaction?.referenceNo}</DialogDescription>
                    </DialogHeader>
                    {selectedTransaction && (
                        <div className="grid gap-4 py-4">
                            <div className="flex items-center justify-between border-b pb-4">
                                <div>
                                    <div className="text-sm text-muted-foreground">Transaction ID</div>
                                    <div className="font-mono">{selectedTransaction.id}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-muted-foreground">Date</div>
                                    <div>{selectedTransaction.createdAt}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Card>
                                    <CardHeader className="p-3">
                                        <CardTitle className="text-sm">Source/Type</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-0">
                                        <Badge variant={transactionTypeColors[selectedTransaction.transactionType]} className="mb-2">
                                            {selectedTransaction.transactionType}
                                        </Badge>
                                        <div className="text-sm font-medium">{selectedTransaction.warehouseName}</div>
                                        <div className="text-xs text-muted-foreground">Loc: {selectedTransaction.locationCode}</div>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="p-3">
                                        <CardTitle className="text-sm">Item Details</CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-3 pt-0">
                                        <div className="text-sm font-medium">{selectedTransaction.skuCode}</div>
                                        <div className="text-xs text-muted-foreground mb-1">{selectedTransaction.skuName}</div>
                                        <div className={selectedTransaction.quantity >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                            Qty: {selectedTransaction.quantity >= 0 ? "+" : ""}{selectedTransaction.quantity}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="bg-muted p-3 rounded-md">
                                <div className="text-xs font-semibold text-muted-foreground uppercase">Reason / Notes</div>
                                <p className="text-sm mt-1">{selectedTransaction.reason}</p>
                            </div>
                            <div className="text-xs text-muted-foreground text-right">
                                Created By: {selectedTransaction.createdBy}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Void Transaction?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to void/delete this transaction reference <strong>{selectedTransaction?.referenceNo}</strong>? This usually requires an offsetting accounting entry instead.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Void Record
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
