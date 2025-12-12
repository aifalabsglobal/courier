"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, ChevronDown, Search, Menu, Home, Book, Package, Truck, Warehouse, FileText, Settings, Code, ArrowLeft, X } from "lucide-react";

interface NavItem {
    title: string;
    href?: string;
    icon?: React.ReactNode;
    children?: NavItem[];
    description?: string;
}

const navigation: NavItem[] = [
    { title: "Home", href: "/docs", icon: <Home className="w-4 h-4" />, description: "Documentation home" },
    { title: "Getting Started", href: "/docs/getting-started", icon: <Book className="w-4 h-4" />, description: "Quick start guide" },
    {
        title: "Modules", icon: <Package className="w-4 h-4" />, children: [
            { title: "Orders Management", href: "/docs/modules/orders", description: "Create and manage orders" },
            { title: "Fleet Management", href: "/docs/modules/fleet", description: "Vehicles, drivers, maintenance" },
            { title: "Warehouse Management", href: "/docs/modules/warehouse", description: "Inventory and storage" },
            { title: "Billing & Invoicing", href: "/docs/modules/billing", description: "Invoices and tariffs" },
            { title: "Transportation", href: "/docs/modules/transportation", description: "Routes, trips, tracking" },
            { title: "Master Data", href: "/docs/modules/master-data", description: "Customers, vendors, locations" },
        ]
    },
    {
        title: "Features", icon: <Settings className="w-4 h-4" />, children: [
            { title: "Dashboard Analytics", href: "/docs/features/dashboard", description: "Key metrics and charts" },
            { title: "Tracking & Monitoring", href: "/docs/features/tracking", description: "Real-time shipment tracking" },
            { title: "Waybill Generation", href: "/docs/features/waybill", description: "Printable waybills" },
            { title: "User Management", href: "/docs/features/users", description: "Roles and permissions" },
        ]
    },
    {
        title: "API Reference", icon: <Code className="w-4 h-4" />, children: [
            { title: "Authentication", href: "/docs/api/authentication", description: "API authentication guide" },
            { title: "Orders API", href: "/docs/api/orders", description: "Orders endpoints" },
            { title: "Customers API", href: "/docs/api/customers", description: "Customers endpoints" },
            { title: "Vehicles API", href: "/docs/api/vehicles", description: "Vehicles endpoints" },
        ]
    },
];

// Flatten navigation for search
function flattenNavigation(items: NavItem[], parentTitle = ""): { title: string; href: string; description: string; category: string }[] {
    const result: { title: string; href: string; description: string; category: string }[] = [];
    for (const item of items) {
        if (item.href) {
            result.push({
                title: item.title,
                href: item.href,
                description: item.description || "",
                category: parentTitle
            });
        }
        if (item.children) {
            result.push(...flattenNavigation(item.children, item.title));
        }
    }
    return result;
}

const allPages = flattenNavigation(navigation);

function NavSection({ item, depth = 0 }: { item: NavItem; depth?: number }) {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const isActive = item.href === pathname;
    const hasChildren = item.children && item.children.length > 0;

    return (
        <div>
            {item.href ? (
                <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${isActive
                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600"
                        : "text-gray-700 hover:bg-gray-100"
                        } ${depth > 0 ? "ml-5" : ""}`}
                >
                    {item.icon}
                    {item.title}
                </Link>
            ) : (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors ${depth > 0 ? "ml-5" : ""}`}
                >
                    <span className="flex items-center gap-2">
                        {item.icon}
                        {item.title}
                    </span>
                    {hasChildren && (isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />)}
                </button>
            )}
            {hasChildren && isOpen && (
                <div className="mt-1">
                    {item.children!.map((child, i) => (
                        <NavSection key={i} item={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}

function SearchDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [query, setQuery] = useState("");
    const router = useRouter();

    const results = query.length > 0
        ? allPages.filter(p =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.description.toLowerCase().includes(query.toLowerCase())
        )
        : [];

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
            <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
                    <Search className="w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search documentation..."
                        className="flex-1 text-lg outline-none"
                        autoFocus
                    />
                    <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {query.length === 0 ? (
                        <div className="p-4 text-sm text-gray-500">
                            <p className="font-medium mb-2">Quick links</p>
                            <div className="space-y-1">
                                {allPages.slice(0, 5).map((p, i) => (
                                    <button key={i} onClick={() => handleSelect(p.href)} className="block w-full text-left px-3 py-2 hover:bg-gray-100 rounded-md">
                                        <span className="text-gray-900">{p.title}</span>
                                        {p.category && <span className="text-gray-400 text-xs ml-2">{p.category}</span>}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <p>No results found for &quot;{query}&quot;</p>
                        </div>
                    ) : (
                        <div className="p-2">
                            {results.map((p, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSelect(p.href)}
                                    className="block w-full text-left px-3 py-3 hover:bg-blue-50 rounded-lg"
                                >
                                    <div className="font-medium text-gray-900">{p.title}</div>
                                    <div className="text-sm text-gray-500">{p.description}</div>
                                    {p.category && <div className="text-xs text-blue-600 mt-1">{p.category}</div>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded mr-1">↑↓</kbd> to navigate
                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded mx-1">Enter</kbd> to select
                    <kbd className="px-1.5 py-0.5 bg-gray-200 rounded mx-1">Esc</kbd> to close
                </div>
            </div>
        </div>
    );
}

export default function DocsLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Keyboard shortcut for search
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
        <div className="min-h-screen bg-white">
            <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between h-14 px-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">Courier</span>
                            <span className="text-gray-400">|</span>
                            <span className="text-sm text-gray-600">Documentation</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSearchOpen(true)}
                            className="hidden md:flex items-center gap-2 w-64 px-3 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50"
                        >
                            <Search className="w-4 h-4" />
                            <span className="flex-1 text-left">Search docs...</span>
                            <kbd className="px-1.5 py-0.5 text-xs text-gray-400 bg-gray-100 rounded">⌘K</kbd>
                        </button>
                        <Link href="/dashboard" className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
                            <ArrowLeft className="w-4 h-4" />
                            Back to App
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className={`fixed lg:sticky top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-72 bg-white border-r border-gray-200 overflow-y-auto transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                    <nav className="p-4 space-y-1">
                        {navigation.map((item, i) => (
                            <NavSection key={i} item={item} />
                        ))}
                    </nav>
                </aside>

                {/* Mobile overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    <div className="max-w-4xl mx-auto px-6 py-10">
                        {children}
                    </div>
                </main>

                {/* Right Sidebar - Table of Contents */}
                <aside className="hidden xl:block w-64 shrink-0">
                    <div className="sticky top-14 p-6">
                        <h4 className="text-sm font-semibold text-gray-900 mb-4">On this page</h4>
                        <div className="text-sm text-gray-600 space-y-2">
                            <p className="text-xs text-gray-400">Table of contents will appear here based on page headings</p>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
