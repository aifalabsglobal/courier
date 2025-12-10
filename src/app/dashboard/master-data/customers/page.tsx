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
import { Plus, Search, Edit, Trash2, Eye, Building, MapPin, Loader2, Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  creditLimit: number;
  paymentTerms: string;
  isActive: boolean;
}

const mockCustomers: Customer[] = [
  {
    id: "1",
    code: "CUST001",
    name: "Acme Corporation",
    email: "contact@acme.com",
    phone: "+1-555-0101",
    city: "New York",
    country: "USA",
    creditLimit: 50000,
    paymentTerms: "NET30",
    isActive: true,
  },
  {
    id: "2",
    code: "CUST002",
    name: "Global Logistics",
    email: "info@globallogistics.com",
    phone: "+1-555-0102",
    city: "Los Angeles",
    country: "USA",
    creditLimit: 75000,
    paymentTerms: "NET15",
    isActive: true,
  },
  {
    id: "3",
    code: "CUST003",
    name: "Fast Shipping Co",
    email: "hello@fastshipping.com",
    phone: "+1-555-0103",
    city: "Chicago",
    country: "USA",
    creditLimit: 30000,
    paymentTerms: "NET45",
    isActive: false,
  },
];

export default function CustomersPage() {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Selected items
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    creditLimit: 0,
    paymentTerms: "NET30",
    isActive: true
  });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      code: `CUST${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      name: "",
      email: "",
      phone: "",
      city: "",
      country: "USA",
      creditLimit: 10000,
      paymentTerms: "NET30",
      isActive: true
    });
  };

  const handleCreate = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCustomer: Customer = {
      id: Date.now().toString(),
      ...formData,
    };

    setCustomers([...customers, newCustomer]);
    setIsCreateDialogOpen(false);
    resetForm();
    setIsLoading(false);
    toast({ title: "Customer Added", description: `${formData.name} has been added successfully.` });
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      code: customer.code,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      country: customer.country,
      creditLimit: customer.creditLimit,
      paymentTerms: customer.paymentTerms,
      isActive: customer.isActive
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedCustomer) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setCustomers(customers.map(c =>
      c.id === selectedCustomer.id
        ? { ...c, ...formData }
        : c
    ));
    setIsEditDialogOpen(false);
    setSelectedCustomer(null);
    setIsLoading(false);
    toast({ title: "Customer Updated", description: `${formData.name} has been updated successfully.` });
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    setCustomers(customers.filter(c => c.id !== selectedCustomer.id));
    setIsDeleteDialogOpen(false);
    setSelectedCustomer(null);
    setIsLoading(false);
    toast({ title: "Customer Deleted", description: "Customer has been removed.", variant: "destructive" });
  };

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.isActive).length,
    totalCredit: customers.reduce((sum, c) => sum + c.creditLimit, 0)
  };

  const CustomerForm = () => (
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
        <Label className="text-right">Credit Limit</Label>
        <Input
          type="number"
          value={formData.creditLimit}
          onChange={(e) => setFormData({ ...formData, creditLimit: parseInt(e.target.value) || 0 })}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label className="text-right">Terms</Label>
        <div className="col-span-3">
          <select
            className="w-full border rounded-md px-3 py-2 text-sm bg-background"
            value={formData.paymentTerms}
            onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
          >
            <option value="NET15">NET15</option>
            <option value="NET30">NET30</option>
            <option value="NET45">NET45</option>
            <option value="NET60">NET60</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage customer accounts and details</p>
        </div>
        <Button onClick={() => { resetForm(); setIsCreateDialogOpen(true); }}>
          <Plus className="h-4 w-4 mr-2" />Add Customer
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Building className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">{stats.active}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credit Limit</CardTitle>
            <Building className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold text-blue-600">${stats.totalCredit.toLocaleString()}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Directory of all registered customers.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
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
                <TableHead>Credit Limit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.code}</TableCell>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{customer.email}</span>
                      <span className="flex items-center gap-1 text-muted-foreground"><Phone className="h-3 w-3" />{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {customer.city}, {customer.country}
                    </div>
                  </TableCell>
                  <TableCell>${customer.creditLimit.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={customer.isActive ? "default" : "secondary"}>
                      {customer.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handleView(customer)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(customer)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(customer)} className="text-red-600"><Trash2 className="h-4 w-4" /></Button>
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
            <DialogTitle>Add Customer</DialogTitle>
            <DialogDescription>Create a new customer profile.</DialogDescription>
          </DialogHeader>
          <CustomerForm />
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
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Modify customer details.</DialogDescription>
          </DialogHeader>
          <CustomerForm />
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
            <DialogTitle>Customer Details</DialogTitle>
            <DialogDescription>Full information for {selectedCustomer?.code}</DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground text-xs">Name</Label>
                  <div className="font-medium">{selectedCustomer.name}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Email</Label>
                  <div className="font-medium">{selectedCustomer.email}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Phone</Label>
                  <div className="font-medium">{selectedCustomer.phone}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Location</Label>
                  <div className="font-medium">{selectedCustomer.city}, {selectedCustomer.country}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Credit Limit</Label>
                  <div className="font-medium">${selectedCustomer.creditLimit.toLocaleString()}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Payment Terms</Label>
                  <div className="font-medium">{selectedCustomer.paymentTerms}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-xs">Status</Label>
                  <Badge className="mt-1" variant={selectedCustomer.isActive ? "default" : "secondary"}>
                    {selectedCustomer.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            <Button onClick={() => { setIsViewDialogOpen(false); if (selectedCustomer) handleEdit(selectedCustomer); }}>
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
              This action cannot be undone. This will permanently delete the customer
              <strong> {selectedCustomer?.name}</strong>.
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