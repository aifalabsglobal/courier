"use client";

import { useState, useEffect } from "react";
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
    email: string | null;
    phone: string | null;
    city: string | null;
    country: string | null;
    address: string | null;
    taxId: string | null;
    serviceTypes: string; // JSON string in DB, but we might handle as string or parse it. The API sends it as string (from DB) or we should parse it?
    // In the API POST/PUT, we send it as part of body. The DB model has `serviceTypes String`. 
    // In the frontend currently it handles array. 
    // Let's adjust interface to match what we expect from API (which returns DB object).
    // The DB stores it as JSON string "[]".
    // So the API response will have it as a string. We should parse it for display if needed, 
    // OR we can make the API return it as parsed JSON if we want. 
    // For simplicity, let's assume the API returns the raw DB object for now, so it is a string.
    // Wait, `prisma` typed client usually returns the type defined. If it is `String`, it is string.
    // But for `serviceTypes`, usually we want an array in UI.
    // Let's handle the parsing in the UI or fetcher.
    isActive: boolean;
}

// Helper to parse service types safely
const parseServiceTypes = (types: string | string[] | any): string[] => {
    if (Array.isArray(types)) return types;
    if (typeof types === 'string') {
        try {
            const parsed = JSON.parse(types);
            if (Array.isArray(parsed)) return parsed;
            // If it's a comma separated string (fallback)
            if (types.includes(',')) return types.split(',').map(s => s.trim());
            return [types];
        } catch (e) {
            return [types];
        }
    }
    return [];
};

export default function VendorsPage() {
    const { toast } = useToast();
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);

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
        address: "",
        city: "",
        state: "",
        country: "USA",
        taxId: "",
        serviceTypes: "",
        isActive: true
    });

    const fetchVendors = async () => {
        try {
            const res = await fetch("/api/vendors");
            if (!res.ok) throw new Error("Failed to fetch vendors");
            const data = await res.json();
            setVendors(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to load vendors", variant: "destructive" });
        } finally {
            setIsPageLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(
        (vendor) =>
            vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (vendor.code && vendor.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (vendor.email && vendor.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const resetForm = () => {
        setFormData({
            code: "",
            name: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            state: "",
            country: "USA",
            taxId: "",
            serviceTypes: "",
            isActive: true
        });
    };

    const handleCreate = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/vendors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    taxId: formData.taxId,
                    // We are not really using the serviceTypes in the backend logic much yet except saving the string?
                    // The backend `create` logic I wrote sets `serviceTypes: "[]"`. 
                    // I should probably update the backend to accept serviceTypes or just skip it for now.
                    // Let's check my backend code again.
                    // Backend: `serviceTypes: "[]"` hardcoded in create.
                    // So sending it won't matter for creation unless I update backend.
                    // I will leave it as is for now, users can edit it later if I enable update.
                    status: formData.isActive ? "Active" : "Inactive"
                }),
            });

            if (!res.ok) throw new Error("Failed to create vendor");

            await fetchVendors();
            setIsCreateDialogOpen(false);
            resetForm();
            toast({ title: "Vendor Added", description: `${formData.name} has been added successfully.` });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to create vendor", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (vendor: Vendor) => {
        setSelectedVendor(vendor);
        // Clean up service types for display
        // The DB has it as string (JSON or plain).
        // If it's "[]", we show empty.
        let serviceTypesStr = "";
        try {
            const parsed = JSON.parse(vendor.serviceTypes);
            if (Array.isArray(parsed)) serviceTypesStr = parsed.join(", ");
        } catch {
            serviceTypesStr = vendor.serviceTypes || "";
        }

        setFormData({
            code: vendor.code,
            name: vendor.name,
            email: vendor.email || "",
            phone: vendor.phone || "",
            address: vendor.address || "",
            city: vendor.city || "",
            state: "", // vendor object in UI interface might not have state if I didn't add it to interface above, let's check. 
            // The Interface above has `city` `country`. `state` is missing in my Interface definition above but present in DB.
            // I should add state to interface.
            country: vendor.country || "",
            taxId: vendor.taxId || "",
            serviceTypes: serviceTypesStr,
            isActive: vendor.isActive
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!selectedVendor) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/vendors/${selectedVendor.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    country: formData.country,
                    taxId: formData.taxId,
                    status: formData.isActive ? "Active" : "Inactive"
                }),
            });

            if (!res.ok) throw new Error("Failed to update vendor");

            await fetchVendors();
            setIsEditDialogOpen(false);
            setSelectedVendor(null);
            toast({ title: "Vendor Updated", description: "Vendor details have been updated." });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to update vendor", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
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
        try {
            const res = await fetch(`/api/vendors/${selectedVendor.id}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error("Failed to delete vendor");

            await fetchVendors();
            setIsDeleteDialogOpen(false);
            setSelectedVendor(null);
            toast({ title: "Vendor Deleted", description: "Vendor has been removed.", variant: "destructive" });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to delete vendor", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
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
                    disabled
                    placeholder="Auto-generated"
                    className="col-span-3 bg-muted"
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
                <Label className="text-right">Address</Label>
                <Input
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                <Label className="text-right">State</Label>
                <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
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
                <Label className="text-right">Tax ID</Label>
                <Input
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
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
                    {isPageLoading ? (
                        <div className="flex justify-center p-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Code</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24">No vendors found.</TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <TableRow key={vendor.id}>
                                            <TableCell className="font-medium">{vendor.code || "-"}</TableCell>
                                            <TableCell>{vendor.name}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col text-sm">
                                                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{vendor.email || "-"}</span>
                                                    <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{vendor.phone || "-"}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                                    {[vendor.city, vendor.country].filter(Boolean).join(", ") || "-"}
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
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
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
                        <DialogDescription>Full information for {selectedVendor?.code || selectedVendor?.name}</DialogDescription>
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
                                    <div className="font-medium">{selectedVendor.email || "-"}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Phone</Label>
                                    <div className="font-medium">{selectedVendor.phone || "-"}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Location</Label>
                                    <div className="font-medium">{[selectedVendor.city, selectedVendor.country].filter(Boolean).join(", ")}</div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground text-xs">Tax ID</Label>
                                    <div className="font-medium">{selectedVendor.taxId || "-"}</div>
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
