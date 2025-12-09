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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search, Edit, Trash2, Eye, Package, Calendar } from "lucide-react";

interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  orderType: string;
  status: string;
  priority: string;
  pickupDate: string;
  deliveryDate: string;
  totalWeight: number;
  totalVolume: number;
  totalValue: number;
  freightCharge: number;
  totalCharges: number;
  shipperCity: string;
  consigneeCity: string;
}

const mockOrders: Order[] = [
  {
    id: "1",
    orderNo: "ORD-2024-001",
    customerName: "Acme Corporation",
    orderType: "FTL",
    status: "CONFIRMED",
    priority: "HIGH",
    pickupDate: "2024-01-15",
    deliveryDate: "2024-01-17",
    totalWeight: 15000,
    totalVolume: 25,
    totalValue: 25000,
    freightCharge: 1200,
    totalCharges: 1350,
    shipperCity: "New York",
    consigneeCity: "Boston",
  },
  {
    id: "2",
    orderNo: "ORD-2024-002",
    customerName: "Global Logistics",
    orderType: "LTL",
    status: "DISPATCHED",
    priority: "NORMAL",
    pickupDate: "2024-01-14",
    deliveryDate: "2024-01-16",
    totalWeight: 8500,
    totalVolume: 15,
    totalValue: 12000,
    freightCharge: 800,
    totalCharges: 920,
    shipperCity: "Los Angeles",
    consigneeCity: "San Francisco",
  },
  {
    id: "3",
    orderNo: "ORD-2024-003",
    customerName: "Fast Shipping Co",
    orderType: "PARCEL",
    status: "DELIVERED",
    priority: "URGENT",
    pickupDate: "2024-01-13",
    deliveryDate: "2024-01-14",
    totalWeight: 500,
    totalVolume: 2,
    totalValue: 3500,
    freightCharge: 150,
    totalCharges: 175,
    shipperCity: "Chicago",
    consigneeCity: "Detroit",
  },
];

const orderTypes = ["FTL", "LTL", "PARCEL", "CONTAINER", "MULTIMODAL"];
const orderStatuses = ["DRAFT", "CONFIRMED", "PLANNED", "DISPATCHED", "IN_TRANSIT", "DELIVERED", "POD_RECEIVED", "CLOSED"];
const priorities = ["LOW", "NORMAL", "HIGH", "URGENT"];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    orderNo: "",
    customerName: "",
    orderType: "",
    status: "DRAFT",
    priority: "NORMAL",
    pickupDate: "",
    deliveryDate: "",
    totalWeight: 0,
    totalVolume: 0,
    totalValue: 0,
    freightCharge: 0,
    totalCharges: 0,
    shipperName: "",
    shipperAddress: "",
    shipperCity: "",
    shipperState: "",
    shipperCountry: "",
    shipperPostalCode: "",
    shipperPhone: "",
    consigneeName: "",
    consigneeAddress: "",
    consigneeCity: "",
    consigneeState: "",
    consigneeCountry: "",
    consigneePostalCode: "",
    consigneePhone: "",
    description: "",
    deliveryInstructions: "",
  });

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newOrder: Order = {
      id: Date.now().toString(),
      orderNo: formData.orderNo,
      customerName: formData.customerName,
      orderType: formData.orderType,
      status: formData.status,
      priority: formData.priority,
      pickupDate: formData.pickupDate,
      deliveryDate: formData.deliveryDate,
      totalWeight: formData.totalWeight,
      totalVolume: formData.totalVolume,
      totalValue: formData.totalValue,
      freightCharge: formData.freightCharge,
      totalCharges: formData.totalCharges,
      shipperCity: formData.shipperCity,
      consigneeCity: formData.consigneeCity,
    };
    setOrders([...orders, newOrder]);
    setIsCreateDialogOpen(false);
    resetForm();
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      orderNo: order.orderNo,
      customerName: order.customerName,
      orderType: order.orderType,
      status: order.status,
      priority: order.priority,
      pickupDate: order.pickupDate,
      deliveryDate: order.deliveryDate,
      totalWeight: order.totalWeight,
      totalVolume: order.totalVolume,
      totalValue: order.totalValue,
      freightCharge: order.freightCharge,
      totalCharges: order.totalCharges,
      shipperName: "",
      shipperAddress: "",
      shipperCity: order.shipperCity,
      shipperState: "",
      shipperCountry: "",
      shipperPostalCode: "",
      shipperPhone: "",
      consigneeName: "",
      consigneeAddress: "",
      consigneeCity: order.consigneeCity,
      consigneeState: "",
      consigneeCountry: "",
      consigneePostalCode: "",
      consigneePhone: "",
      description: "",
      deliveryInstructions: "",
    });
  };

  const handleUpdate = () => {
    if (editingOrder) {
      setOrders(
        orders.map((o) =>
          o.id === editingOrder.id
            ? {
                ...o,
                orderNo: formData.orderNo,
                customerName: formData.customerName,
                orderType: formData.orderType,
                status: formData.status,
                priority: formData.priority,
                pickupDate: formData.pickupDate,
                deliveryDate: formData.deliveryDate,
                totalWeight: formData.totalWeight,
                totalVolume: formData.totalVolume,
                totalValue: formData.totalValue,
                freightCharge: formData.freightCharge,
                totalCharges: formData.totalCharges,
                shipperCity: formData.shipperCity,
                consigneeCity: formData.consigneeCity,
              }
            : o
        )
      );
      setEditingOrder(null);
      resetForm();
    }
  };

  const handleDelete = (id: string) => {
    setOrders(orders.filter((o) => o.id !== id));
  };

  const resetForm = () => {
    setFormData({
      orderNo: "",
      customerName: "",
      orderType: "",
      status: "DRAFT",
      priority: "NORMAL",
      pickupDate: "",
      deliveryDate: "",
      totalWeight: 0,
      totalVolume: 0,
      totalValue: 0,
      freightCharge: 0,
      totalCharges: 0,
      shipperName: "",
      shipperAddress: "",
      shipperCity: "",
      shipperState: "",
      shipperCountry: "",
      shipperPostalCode: "",
      shipperPhone: "",
      consigneeName: "",
      consigneeAddress: "",
      consigneeCity: "",
      consigneeState: "",
      consigneeCountry: "",
      consigneePostalCode: "",
      consigneePhone: "",
      description: "",
      deliveryInstructions: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "secondary";
      case "CONFIRMED":
        return "default";
      case "DISPATCHED":
        return "secondary";
      case "IN_TRANSIT":
        return "secondary";
      case "DELIVERED":
        return "default";
      default:
        return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "destructive";
      case "HIGH":
        return "secondary";
      case "NORMAL":
        return "default";
      case "LOW":
        return "outline";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage your shipment orders</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>
                Create a new shipment order. Fill in the required information.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="orderNo">Order No</Label>
                  <Input
                    id="orderNo"
                    value={formData.orderNo}
                    onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="customerName">Customer</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="orderType">Order Type</Label>
                  <Select
                    value={formData.orderType}
                    onValueChange={(value) => setFormData({ ...formData, orderType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select order type" />
                    </SelectTrigger>
                    <SelectContent>
                      {orderTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => setFormData({ ...formData, pickupDate: e.target.value })}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="deliveryDate">Delivery Date</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid items-center gap-2">
                  <Label htmlFor="totalWeight">Weight (kg)</Label>
                  <Input
                    id="totalWeight"
                    type="number"
                    value={formData.totalWeight}
                    onChange={(e) => setFormData({ ...formData, totalWeight: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="totalVolume">Volume (m³)</Label>
                  <Input
                    id="totalVolume"
                    type="number"
                    value={formData.totalVolume}
                    onChange={(e) => setFormData({ ...formData, totalVolume: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="grid items-center gap-2">
                  <Label htmlFor="totalValue">Value ($)</Label>
                  <Input
                    id="totalValue"
                    type="number"
                    value={formData.totalValue}
                    onChange={(e) => setFormData({ ...formData, totalValue: parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Shipper Information</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Shipper Name"
                    value={formData.shipperName}
                    onChange={(e) => setFormData({ ...formData, shipperName: e.target.value })}
                  />
                  <Input
                    placeholder="Shipper Phone"
                    value={formData.shipperPhone}
                    onChange={(e) => setFormData({ ...formData, shipperPhone: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Shipper Address"
                  value={formData.shipperAddress}
                  onChange={(e) => setFormData({ ...formData, shipperAddress: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    value={formData.shipperCity}
                    onChange={(e) => setFormData({ ...formData, shipperCity: e.target.value })}
                  />
                  <Input
                    placeholder="State"
                    value={formData.shipperState}
                    onChange={(e) => setFormData({ ...formData, shipperState: e.target.value })}
                  />
                  <Input
                    placeholder="Country"
                    value={formData.shipperCountry}
                    onChange={(e) => setFormData({ ...formData, shipperCountry: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Consignee Information</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="Consignee Name"
                    value={formData.consigneeName}
                    onChange={(e) => setFormData({ ...formData, consigneeName: e.target.value })}
                  />
                  <Input
                    placeholder="Consignee Phone"
                    value={formData.consigneePhone}
                    onChange={(e) => setFormData({ ...formData, consigneePhone: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Consignee Address"
                  value={formData.consigneeAddress}
                  onChange={(e) => setFormData({ ...formData, consigneeAddress: e.target.value })}
                />
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    placeholder="City"
                    value={formData.consigneeCity}
                    onChange={(e) => setFormData({ ...formData, consigneeCity: e.target.value })}
                  />
                  <Input
                    placeholder="State"
                    value={formData.consigneeState}
                    onChange={(e) => setFormData({ ...formData, consigneeState: e.target.value })}
                  />
                  <Input
                    placeholder="Country"
                    value={formData.consigneeCountry}
                    onChange={(e) => setFormData({ ...formData, consigneeCountry: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Order description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleCreate}>
                Create Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>
            A list of all shipment orders in your system including their status and details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order No</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Pickup</TableHead>
                <TableHead>Delivery</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Weight/Volume</TableHead>
                <TableHead>Charges</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNo}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{order.orderType}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(order.priority)}>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.pickupDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.deliveryDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.shipperCity}</div>
                      <div className="text-gray-500">→ {order.consigneeCity}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{order.totalWeight.toLocaleString()} kg</div>
                      <div className="text-gray-500">{order.totalVolume} m³</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>${order.freightCharge}</div>
                      <div className="text-gray-500">${order.totalCharges}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(order)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(order.id)}>
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

      {/* Edit Dialog */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Update order information. Make sure to save your changes.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="edit-orderNo">Order No</Label>
                <Input
                  id="edit-orderNo"
                  value={formData.orderNo}
                  onChange={(e) => setFormData({ ...formData, orderNo: e.target.value })}
                />
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="edit-customerName">Customer</Label>
                <Input
                  id="edit-customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid items-center gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid items-center gap-2">
                <Label htmlFor="edit-priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => setFormData({ ...formData, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpdate}>
              Update Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}