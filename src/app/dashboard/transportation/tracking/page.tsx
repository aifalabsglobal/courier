"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Plus, Search, MapPin, Clock, Package, Truck, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrackingEvent { id: string; orderId?: string; tripId?: string; eventType: string; location: string | null; description: string | null; timestamp: string; order?: { orderNo: string }; trip?: { tripNo: string }; }
interface Order { id: string; orderNo: string; }
interface Trip { id: string; tripNo: string; }

const eventTypes = ["DEPARTED", "ARRIVED", "LOADED", "UNLOADED", "DISPATCHED", "DELAYED", "BREAKDOWN", "DELIVERED", "CANCELLED"];

export default function TrackingPage() {
  const { toast } = useToast();
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ orderId: "", tripId: "", eventType: "DEPARTED", location: "", description: "" });

  const fetchData = async () => {
    try {
      const [r1, r2, r3] = await Promise.all([fetch("/api/tracking"), fetch("/api/orders"), fetch("/api/trips")]);
      if (r1.ok) setEvents(await r1.json());
      if (r2.ok) setOrders(await r2.json());
      if (r3.ok) setTrips(await r3.json());
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsPageLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = events.filter(e => (e.order?.orderNo && e.order.orderNo.toLowerCase().includes(searchTerm.toLowerCase())) || (e.location && e.location.toLowerCase().includes(searchTerm.toLowerCase())));
  const resetForm = () => setForm({ orderId: "", tripId: "", eventType: "DEPARTED", location: "", description: "" });

  const handleCreate = async () => {
    if (!form.eventType) { toast({ title: "Error", description: "Event type required", variant: "destructive" }); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/tracking", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error();
      await fetchData(); setIsCreateOpen(false); resetForm(); toast({ title: "Event Created" });
    } catch { toast({ title: "Error", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  const getIcon = (type: string) => {
    if (type === "DEPARTED" || type === "ARRIVED") return <Truck className="h-4 w-4" />;
    if (type === "DELAYED" || type === "BREAKDOWN") return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    if (type === "DELIVERED") return <Package className="h-4 w-4 text-green-500" />;
    return <MapPin className="h-4 w-4" />;
  };

  const getColor = (type: string) => {
    if (type === "DELIVERED") return "default";
    if (type === "DELAYED" || type === "BREAKDOWN" || type === "CANCELLED") return "destructive";
    if (type === "IN_TRANSIT" || type === "DISPATCHED") return "secondary";
    return "outline";
  };

  const Form = () => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Order</Label><Select value={form.orderId} onValueChange={(v) => setForm({ ...form, orderId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select order" /></SelectTrigger><SelectContent>{orders.map(o => <SelectItem key={o.id} value={o.id}>{o.orderNo}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Trip</Label><Select value={form.tripId} onValueChange={(v) => setForm({ ...form, tripId: v })}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select trip" /></SelectTrigger><SelectContent>{trips.map(t => <SelectItem key={t.id} value={t.id}>{t.tripNo}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Event Type</Label><Select value={form.eventType} onValueChange={(v) => setForm({ ...form, eventType: v })}><SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger><SelectContent>{eventTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="col-span-3" /></div>
      <div className="grid grid-cols-4 items-center gap-4"><Label className="text-right">Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="col-span-3" /></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Tracking</h1><p className="text-gray-600">Track shipments and events</p></div><Button onClick={() => { resetForm(); setIsCreateOpen(true); }}><Plus className="h-4 w-4 mr-2" />Add Event</Button></div>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Total Events</CardTitle><Clock className="h-4 w-4" /></CardHeader><CardContent><div className="text-2xl font-bold">{events.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">In Transit</CardTitle><Truck className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{events.filter(e => e.eventType === "DEPARTED" || e.eventType === "DISPATCHED").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Delivered</CardTitle><Package className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{events.filter(e => e.eventType === "DELIVERED").length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Delays</CardTitle><AlertTriangle className="h-4 w-4 text-orange-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-orange-600">{events.filter(e => e.eventType === "DELAYED").length}</div></CardContent></Card>
      </div>
      <Card><CardHeader><CardTitle>Event History</CardTitle><CardDescription>All tracking events</CardDescription></CardHeader><CardContent>
        <div className="flex items-center space-x-2 mb-4"><Search className="h-4 w-4 text-gray-400" /><Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="max-w-sm" /></div>
        {isPageLoading ? <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div> : (
          <Table><TableHeader><TableRow><TableHead>Event</TableHead><TableHead>Order</TableHead><TableHead>Trip</TableHead><TableHead>Location</TableHead><TableHead>Description</TableHead><TableHead>Time</TableHead></TableRow></TableHeader><TableBody>
            {filtered.length === 0 ? <TableRow><TableCell colSpan={6} className="text-center h-24">No events found.</TableCell></TableRow> :
              filtered.map((e) => (<TableRow key={e.id}><TableCell><div className="flex items-center gap-2">{getIcon(e.eventType)}<Badge variant={getColor(e.eventType)}>{e.eventType}</Badge></div></TableCell><TableCell>{e.order?.orderNo || "-"}</TableCell><TableCell>{e.trip?.tripNo || "-"}</TableCell><TableCell>{e.location || "-"}</TableCell><TableCell className="max-w-xs truncate">{e.description || "-"}</TableCell><TableCell>{new Date(e.timestamp).toLocaleString()}</TableCell></TableRow>))}
          </TableBody></Table>
        )}
      </CardContent></Card>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}><DialogContent><DialogHeader><DialogTitle>Add Tracking Event</DialogTitle></DialogHeader><Form /><DialogFooter><Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button onClick={handleCreate} disabled={isLoading}>{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Create</Button></DialogFooter></DialogContent></Dialog>
    </div>
  );
}