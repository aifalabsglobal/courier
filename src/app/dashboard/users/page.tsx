"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Plus, Search, Edit, Trash2, Users, Eye, Loader2, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User { id: string; email: string; name: string | null; phone: string | null; department: string | null; isActive: boolean; role?: { displayName: string }; branch?: { name: string }; createdAt: string; }

export default function UsersPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<User | null>(null);
    const [form, setForm] = useState({ email: "", name: "", phone: "", department: "" });

    const fetchData = async () => {
        try {
            const res = await fetch("/api/users");
            if (res.ok) setUsers(await res.json());
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsPageLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const filtered = users.filter(u => u.email.toLowerCase().includes(searchTerm.toLowerCase()) || (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())));
    const resetForm = () => setForm({ email: "", name: "", phone: "", department: "" });

    const handleCreate = async () => {
        if (!form.email) { toast({ title: "Error", description: "Email required", variant: "destructive" }); return; }
        setIsLoading(true);
        try {
            const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) throw new Error();
            await fetchData(); setIsCreateOpen(false); resetForm(); toast({ title: "User Created" });
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleEdit = (u: User) => { setSelected(u); setForm({ email: u.email, name: u.name || "", phone: u.phone || "", department: u.department || "" }); setIsEditOpen(true); };

    const handleUpdate = async () => {
        if (!selected) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/users/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
            if (!res.ok) throw new Error();
            await fetchData(); setIsEditOpen(false); setSelected(null); toast({ title: "Updated" });
        } catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const handleDelete = async () => {
        if (!selected) return;
        setIsLoading(true);
        try { await fetch(`/api/users/${selected.id}`, { method: "DELETE" }); await fetchData(); setIsDeleteOpen(false); setSelected(null); toast({ title: "Deleted", variant: "destructive" }); }
        catch { toast({ title: "Error", variant: "destructive" }); }
        finally { setIsLoading(false); }
    };

    const Form = () => (
        <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Department</Label><Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="col-span-3" /></div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Users</h1><p className="text-gray-600">Manage system users</p></div><Button onClick={() => { resetForm(); setIsCreateOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add User</Button></div>
            <div className="grid gap-4 md:grid-cols-3">
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Users</CardTitle><Users className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{users.length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Active</CardTitle><Users className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{users.filter(u => u.isActive).length}</div></CardContent></Card>
                <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Roles</CardTitle><Shield className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{new Set(users.map(u => u.role?.displayName)).size}</div></CardContent></Card>
            </div>
            <Card><CardHeader><CardTitle>User List</CardTitle><CardDescription>All system users</CardDescription></CardHeader><CardContent>
                <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
                {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
                    <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Department</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader><TableBody>
                        {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No users found.</TableCell></TableRow> :
                            filtered.map((u) => (<TableRow key={u.id}><TableCell className="font-medium">{u.name || "-"}</TableCell><TableCell>{u.email}</TableCell><TableCell><Badge variant="outline">{u.role?.displayName || "User"}</Badge></TableCell><TableCell>{u.department || "-"}</TableCell><TableCell><Badge variant={u.isActive ? "default" : "secondary"}>{u.isActive ? "Active" : "Inactive"}</Badge></TableCell><TableCell><div className="flex items-center space-x-1"><Button variant="ghost" size="sm" onClick={() => { setSelected(u); setIsViewOpen(true); }}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => handleEdit(u)}><Edit className="h-4 w-4" /></Button><Button variant="ghost" size="sm" onClick={() => { setSelected(u); setIsDeleteOpen(true); }} className="text-red-600"><Trash2 className="h-4 w-4" /></Button></div></TableCell></TableRow>))}
                    </TableBody></Table>
                )}
            </CardContent></Card>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}><DialogContent><DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}><DialogContent><DialogHeader><DialogTitle>Edit User</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button><Button onClick={handleUpdate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save</Button></DialogFooter></DialogContent></Dialog>
            <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}><DialogContent><DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>{selected && <div className="grid gap-4 py-4 grid-cols-2"><div><Label className="text-muted-foreground text-xs">Name</Label><div className="font-medium">{selected.name || "-"}</div></div><div><Label className="text-muted-foreground text-xs">Email</Label><div className="font-medium">{selected.email}</div></div><div><Label className="text-muted-foreground text-xs">Phone</Label><div className="font-medium">{selected.phone || "-"}</div></div><div><Label className="text-muted-foreground text-xs">Department</Label><div className="font-medium">{selected.department || "-"}</div></div><div><Label className="text-muted-foreground text-xs">Role</Label><Badge variant="outline">{selected.role?.displayName || "User"}</Badge></div><div><Label className="text-muted-foreground text-xs">Status</Label><Badge variant={selected.isActive ? "default" : "secondary"}>{selected.isActive ? "Active" : "Inactive"}</Badge></div></div>}<DialogFooter><Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button></DialogFooter></DialogContent></Dialog>
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete User?</AlertDialogTitle><AlertDialogDescription>Delete user {selected?.email}?</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
        </div>
    );
}
