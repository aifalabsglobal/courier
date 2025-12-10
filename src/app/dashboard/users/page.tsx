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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Users, Shield, Mail, Eye, Edit, Trash2, Loader2, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    branch: string;
    status: "active" | "inactive";
    lastActive: string;
    createdAt: string;
    phone: string;
}

const mockUsers: User[] = [
    { id: "1", name: "John Smith", email: "john.smith@company.com", role: "Admin", branch: "Dallas HQ", status: "active", lastActive: "2024-12-09 14:30", createdAt: "2023-01-15", phone: "+1 555-0101" },
    { id: "2", name: "Sarah Williams", email: "sarah.williams@company.com", role: "Manager", branch: "Houston", status: "active", lastActive: "2024-12-09 12:15", createdAt: "2023-03-22", phone: "+1 555-0102" },
    { id: "3", name: "Mike Johnson", email: "mike.johnson@company.com", role: "Dispatcher", branch: "Dallas HQ", status: "active", lastActive: "2024-12-09 10:45", createdAt: "2023-06-10", phone: "+1 555-0103" },
    { id: "4", name: "Emily Brown", email: "emily.brown@company.com", role: "Warehouse", branch: "Austin", status: "inactive", lastActive: "2024-12-01 09:00", createdAt: "2023-08-05", phone: "+1 555-0104" },
    { id: "5", name: "Tom Wilson", email: "tom.wilson@company.com", role: "Driver Coordinator", branch: "San Antonio", status: "active", lastActive: "2024-12-09 13:20", createdAt: "2023-11-18", phone: "+1 555-0105" },
];

const roles = ["Admin", "Manager", "Dispatcher", "Warehouse", "Driver Coordinator", "Viewer"];
const branches = ["Dallas HQ", "Houston", "Austin", "San Antonio", "Fort Worth", "El Paso"];

export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Create dialog
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

    // Edit dialog
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // View dialog
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [viewingUser, setViewingUser] = useState<User | null>(null);

    // Delete dialog
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deletingUser, setDeletingUser] = useState<User | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "Viewer",
        branch: "Dallas HQ",
        status: "active" as "active" | "inactive",
    });

    const filteredUsers = users.filter(
        (user) =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.branch.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const resetForm = () => {
        setFormData({ name: "", email: "", phone: "", role: "Viewer", branch: "Dallas HQ", status: "active" });
    };

    const handleCreate = async () => {
        if (!formData.name || !formData.email) {
            toast({ title: "Error", description: "Name and email are required.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        const newUser: User = {
            id: Date.now().toString(),
            ...formData,
            lastActive: "-",
            createdAt: new Date().toISOString().split("T")[0],
        };
        setUsers([...users, newUser]);
        setIsCreateDialogOpen(false);
        resetForm();
        setIsLoading(false);
        toast({ title: "User Created", description: `${formData.name} has been added successfully.` });
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            branch: user.branch,
            status: user.status,
        });
        setIsEditDialogOpen(true);
    };

    const handleUpdate = async () => {
        if (!editingUser) return;
        if (!formData.name || !formData.email) {
            toast({ title: "Error", description: "Name and email are required.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setUsers(users.map(u =>
            u.id === editingUser.id
                ? { ...u, ...formData }
                : u
        ));
        setIsEditDialogOpen(false);
        setEditingUser(null);
        resetForm();
        setIsLoading(false);
        toast({ title: "User Updated", description: `${formData.name} has been updated successfully.` });
    };

    const handleView = (user: User) => {
        setViewingUser(user);
        setIsViewDialogOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setDeletingUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingUser) return;
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 500));

        setUsers(users.filter((u) => u.id !== deletingUser.id));
        setIsDeleteDialogOpen(false);
        setIsLoading(false);
        toast({ title: "User Deleted", description: `${deletingUser.name} has been removed.`, variant: "destructive" });
        setDeletingUser(null);
    };

    const handleToggleStatus = async (user: User) => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 300));

        const newStatus = user.status === "active" ? "inactive" : "active";
        setUsers(users.map(u =>
            u.id === user.id ? { ...u, status: newStatus } : u
        ));
        setIsLoading(false);
        toast({
            title: newStatus === "active" ? "User Activated" : "User Deactivated",
            description: `${user.name} is now ${newStatus}.`
        });
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "Admin": return "bg-red-500";
            case "Manager": return "bg-purple-500";
            case "Dispatcher": return "bg-blue-500";
            case "Warehouse": return "bg-green-500";
            case "Driver Coordinator": return "bg-orange-500";
            default: return "bg-gray-500";
        }
    };

    const stats = {
        total: users.length,
        active: users.filter((u) => u.status === "active").length,
        inactive: users.filter((u) => u.status === "inactive").length,
        admins: users.filter((u) => u.role === "Admin").length,
    };

    const UserFormFields = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Name *</Label>
                <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                    placeholder="John Doe"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Email *</Label>
                <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                    placeholder="john@company.com"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Phone</Label>
                <Input
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="col-span-3"
                    placeholder="+1 555-0100"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        {roles.map((role) => (
                            <SelectItem key={role} value={role}>{role}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Branch</Label>
                <Select value={formData.branch} onValueChange={(value) => setFormData({ ...formData, branch: value })}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select branch" />
                    </SelectTrigger>
                    <SelectContent>
                        {branches.map((branch) => (
                            <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Status</Label>
                <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                        checked={formData.status === "active"}
                        onCheckedChange={(checked) => setFormData({ ...formData, status: checked ? "active" : "inactive" })}
                    />
                    <span className="text-sm text-muted-foreground">
                        {formData.status === "active" ? "Active" : "Inactive"}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-600">Manage system users and their access permissions</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button><Plus className="h-4 w-4 mr-2" />Add User</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Add New User</DialogTitle>
                            <DialogDescription>Create a new user account with role and permissions.</DialogDescription>
                        </DialogHeader>
                        <UserFormFields />
                        <DialogFooter>
                            <Button variant="outline" onClick={() => { setIsCreateDialogOpen(false); resetForm(); }}>Cancel</Button>
                            <Button onClick={handleCreate} disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Create User
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                        <DialogDescription>Update user information and permissions.</DialogDescription>
                    </DialogHeader>
                    <UserFormFields />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setIsEditDialogOpen(false); resetForm(); }}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* View Dialog */}
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>User Details</DialogTitle>
                        <DialogDescription>Complete information about this user.</DialogDescription>
                    </DialogHeader>
                    {viewingUser && (
                        <div className="grid gap-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                                    {viewingUser.name.split(" ").map(n => n[0]).join("")}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{viewingUser.name}</h3>
                                    <p className="text-muted-foreground">{viewingUser.email}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Role</p>
                                    <Badge className={getRoleBadgeColor(viewingUser.role)}>{viewingUser.role}</Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Status</p>
                                    <Badge variant={viewingUser.status === "active" ? "default" : "secondary"}>
                                        {viewingUser.status === "active" ? "Active" : "Inactive"}
                                    </Badge>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Branch</p>
                                    <p className="font-medium">{viewingUser.branch}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="font-medium">{viewingUser.phone || "-"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p className="font-medium">{viewingUser.createdAt}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Last Active</p>
                                    <p className="font-medium">{viewingUser.lastActive}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>Close</Button>
                        <Button onClick={() => { setIsViewDialogOpen(false); if (viewingUser) handleEdit(viewingUser); }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>{deletingUser?.name}</strong> ({deletingUser?.email}).
                            This action cannot be undone and will revoke all their access.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} className="bg-red-600 hover:bg-red-700">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete User
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{stats.total}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <UserCheck className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-600">{stats.active}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
                        <UserX className="h-4 w-4 text-gray-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-gray-600">{stats.inactive}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                        <Shield className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold text-red-600">{stats.admins}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Users</CardTitle>
                    <CardDescription>Manage user accounts, roles, and permissions.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-4">
                        <Search className="h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Search by name, email, role, or branch..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-md"
                        />
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Branch</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-medium">
                                                {user.name.split(" ").map(n => n[0]).join("")}
                                            </div>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                                    </TableCell>
                                    <TableCell>{user.branch}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={user.status === "active"}
                                                onCheckedChange={() => handleToggleStatus(user)}
                                                disabled={isLoading}
                                            />
                                            <span className={`text-sm ${user.status === "active" ? "text-green-600" : "text-gray-500"}`}>
                                                {user.status === "active" ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{user.lastActive}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-1">
                                            <Button variant="ghost" size="sm" onClick={() => handleView(user)} title="View">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)} title="Edit">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(user)} title="Delete" className="text-red-600 hover:text-red-700">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
