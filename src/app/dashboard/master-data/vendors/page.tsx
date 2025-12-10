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
import { Plus, Search, Edit, Trash2, Eye, Truck, Mail, Phone, Loader2, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Vendor {
    id: string;
    code: string;
    name: string;
    email: string;
    phone: string;
    city: string;
    country: string;
    serviceTypes: string[];
    isActive: boolean;
}

const mockVendors: Vendor[] = [
    {
        id: "1",
        code: "VEN001",
        name: "Express Carriers Ltd",
        email: "contact@expresscarriers.com",
        phone: "+1-555-0201",
        city: "Houston",
        country: "USA",
        serviceTypes: ["FTL", "LTL"],
        isActive: true,
    },
    {
        id: "2",
        code: "VEN002",
        name: "Maritime Shipping Co",
        email: "info@maritimeshipping.com",
        phone: "+1-555-0202",
        city: "Miami",
        country: "USA",
        serviceTypes: ["Container", "Bulk"],
        isActive: true,
    },
    {
        id: "3",
        code: "VEN003",
        name: "Air Freight Express",
        email: "ops@airfreightexpress.com",
        phone: "+1-555-0203",
        city: "Atlanta",
        country: "USA",
        serviceTypes: ["Air Cargo"],
        isActive: false,
    },
];

export default function VendorsPage() {
    const { toast } = useToast();
    const [vendors, setVendors] = useState<Vendor[]>(mockVendors);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Dialog states
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Selected vendor
    const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        email: "",
        phone: "",
        city: "",
        country: "USA",
        serviceTypes: "",
        isActive: true
    });

    const filteredVendors = vendors.filter(
        (vendor) =>
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            code: `VEN${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
            name: "",
            email: "",
            phone: "",
            city: "",
            country: "USA",
            serviceTypes: "",
            isActive: true
        });
    };

    const handleCreate = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const newVendor: Vendor = {
            id: Date.now().toString(),
            code: formData.code,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            city: formData.city,
            country: formData.country,
            serviceTypes: formData.serviceTypes.split(",").map(s => s.trim()).filter(s => s),
            isActive: true,
        };
        setVendors([...vendors, newVendor]);
        setIsCreateDialogOpen(false);
        resetForm();
        setIsLoading(false);
        toast({ title: "Vendor Added", description: `${formData.name} has been added to vendor list.` });
    };

    const handleEdit = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setFormData({
            code: vendor.code,
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            city: vendor.city,
            country: vendor.country,
            serviceTypes: vendor.serviceTypes.join(", "),
            isActive: vendor.isActive
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedVendor) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setVendors(
            vendors.map((v) =>
                v.id === selectedVendor.id
                    ? {
                        ...v,
                        ...formData,
                        serviceTypes: formData.serviceTypes.split(",").map(s => s.trim()).filter(s => s)
                    }
                    : v
            )
        );
        setIsEditDialogOpen(false);
        setSelectedVendor(null);
        setIsLoading(false);
        toast({ title: "Vendor Updated", description: "Vendor details have been updated." });
    };

    const handleView = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedVendor) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setVendors(vendors.filter((v) => v.id !== selectedVendor.id));
        setIsDeleteDialogOpen(false);
        setSelectedVendor(null);
        setIsLoading(false);
        toast({ title: "Vendor Deleted", description: "Vendor has been removed from the system.", variant: "destructive" });
    };

    const stats = {
        total: vendors.length,
        active: vendors.filter(v => v.isActive).length,
        inactive: vendors.filter(v => !v.isActive).length
    };

    const VendorForm = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Code</Label>
                <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name</Label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email</Label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Phone</Label>
                <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">City</Label>
                <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Country</Label>
                <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="col-span-3"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Services</Label>
                <Input
                    placeholder="FTL, LTL, Air (comma separated)"
                    value={formData.serviceTypes}
                    onChange={(e) => setFormData({ ...formData, serviceTypes: e.target.value })}
                    className="col-span-3"
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
                    <p className="text-gray-600">Manage vendor partnerships and contracts</p>
                </div>
                <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
                    <Plus className="h-4 w-4 mr-2" />Add Vendor
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
                        <Truck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Partners</CardTitle>
                        <Truck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{stats.active}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive</CardTitle>
                        <Truck className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-gray-500">{stats.inactive}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Vendor List</CardTitle>
                    <CardDescription>
                        A list of all vendors in your system including their details and status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search vendors..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Code</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Contact</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Services</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredVendors.map((vendor) => (
                                <TableRow key={vendor.id}>
                                    <TableCell className="font-medium">{vendor.code}</TableCell>
                                    <TableCell>{vendor.name}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{vendor.email}</span>
                                            <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{vendor.phone}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-3 w-3 text-muted-foreground" />
                                            {vendor.city}, {vendor.country}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap gap-1">
                                            {vendor.serviceTypes.map((service) => (
                                                <Badge key={service} variant="outline" className="text-xs">{service}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={vendor.isActive ? "default" : "secondary"}>
                                            {vendor.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleView(vendor)}><Eye className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(vendor)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(vendor)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Create Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Vendor</DialogTitle>
                        <DialogDescription>Create a new vendor profile.</DialogDescription>
                    </DialogHeader>
                    <VendorForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleCreate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Vendor</DialogTitle>
                        <DialogDescription>Update vendor information.</DialogDescription>
                    </DialogHeader>
                    <VendorForm />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Vendor Details</DialogTitle>
                        <DialogDescription>Full information for {selectedVendor?.code}</DialogDescription>
                    </DialogHeader>
                    {selectedVendor && (
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-muted-foreground text-xs">Name</Label>
                                    <div className="font-medium">{selectedVendor.name}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Email</Label>
                                    <div className="font-medium">{selectedVendor.email}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Phone</Label>
                                    <div className="font-medium">{selectedVendor.phone}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Location</Label>
                                    <div className="font-medium">{selectedVendor.city}, {selectedVendor.country}</div>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-muted-foreground text-xs">Services</Label>
                                    <div className="flex gap-2 mt-1">
                                        {selectedVendor.serviceTypes.map(s => (
                                            <Badge key={s} variant="outline">{s}</Badge>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Status</Label>
                                    <Badge className="mt-1" variant={selectedVendor.isActive ? "default" : "secondary"}>
                                        {selectedVendor.isActive ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        <Button onClick={() => { setIsViewDialogOpen(false); if (selectedVendor) handleEdit(selectedVendor); }}>
                            <Edit className="h-4 w-4 mr-2" />Edit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{selectedVendor?.name}</strong> from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
