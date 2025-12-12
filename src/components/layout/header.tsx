"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Bell, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

interface SearchItem {
  title: string;
  href: string;
  category: string;
  description?: string;
}

const searchItems: SearchItem[] = [
  // Master Data
  { title: "Customers", href: "/dashboard/master-data/customers", category: "Master Data", description: "Manage customers" },
  { title: "Vendors", href: "/dashboard/master-data/vendors", category: "Master Data", description: "Manage vendors" },
  { title: "Drivers", href: "/dashboard/master-data/drivers", category: "Master Data", description: "Manage drivers" },
  { title: "Locations", href: "/dashboard/master-data/locations", category: "Master Data", description: "Manage locations" },
  // Fleet
  { title: "Vehicles", href: "/dashboard/fleet/vehicles", category: "Fleet", description: "Fleet vehicles" },
  { title: "Vehicle Types", href: "/dashboard/fleet/vehicle-types", category: "Fleet", description: "Vehicle types" },
  { title: "Maintenance", href: "/dashboard/fleet/maintenance", category: "Fleet", description: "Vehicle maintenance" },
  { title: "Fuel Log", href: "/dashboard/fleet/fuel", category: "Fleet", description: "Fuel entries" },
  // Orders
  { title: "Orders", href: "/dashboard/orders", category: "Orders", description: "Manage orders" },
  // Transportation
  { title: "Routes", href: "/dashboard/transportation/routes", category: "Transportation", description: "Route management" },
  { title: "Trips", href: "/dashboard/transportation/trips", category: "Transportation", description: "Trip management" },
  { title: "Tracking", href: "/dashboard/transportation/tracking", category: "Transportation", description: "Shipment tracking" },
  // Warehouse
  { title: "Warehouses", href: "/dashboard/warehouse/warehouses", category: "Warehouse", description: "Warehouse facilities" },
  { title: "Warehouse Locations", href: "/dashboard/warehouse/locations", category: "Warehouse", description: "Storage locations" },
  { title: "Inventory", href: "/dashboard/warehouse/inventory", category: "Warehouse", description: "Stock levels" },
  { title: "Transactions", href: "/dashboard/warehouse/transactions", category: "Warehouse", description: "Inventory transactions" },
  // Billing
  { title: "Invoices", href: "/dashboard/billing/invoices", category: "Billing", description: "Invoice management" },
  { title: "Tariffs", href: "/dashboard/billing/tariffs", category: "Billing", description: "Pricing tariffs" },
  { title: "Reports", href: "/dashboard/billing/reports", category: "Billing", description: "Financial reports" },
  // Users & Settings
  { title: "Users", href: "/dashboard/users", category: "Settings", description: "User management" },
  { title: "Settings", href: "/dashboard/settings", category: "Settings", description: "App settings" },
  // Docs
  { title: "Documentation", href: "/docs", category: "Help", description: "Product documentation" },
];

function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const results = query.length > 0
    ? searchItems.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
    ).slice(0, 8)
    : searchItems.slice(0, 6);

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
    setQuery("");
  };

  useEffect(() => {
    if (!isOpen) setQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, orders, customers..."
            className="flex-1 text-lg outline-none"
            autoFocus
          />
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <div className="p-2">
              {results.map((item, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(item.href)}
                  className="flex items-center gap-3 w-full text-left px-3 py-3 hover:bg-blue-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.title}</div>
                    {item.description && <div className="text-sm text-gray-500">{item.description}</div>}
                  </div>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center gap-4">
          <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">↑↓</kbd> navigate</span>
          <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Enter</kbd> select</span>
          <span><kbd className="px-1.5 py-0.5 bg-gray-200 rounded">Esc</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      setSearchOpen(true);
    }
    if (e.key === "Escape") {
      setSearchOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 w-96 px-3 py-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-100 transition"
            >
              <Search className="h-4 w-4" />
              <span className="flex-1 text-left">Search orders, customers, vehicles...</span>
              <kbd className="px-1.5 py-0.5 text-xs text-gray-400 bg-gray-200 rounded">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                    userButtonPopoverCard: "shadow-xl",
                    userButtonPopoverActionButton: "hover:bg-gray-100",
                  }
                }}
              />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
    </>
  );
}