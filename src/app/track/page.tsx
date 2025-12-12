"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle, Search, ArrowLeft, Loader2, User } from "lucide-react";

interface TrackingEvent {
    id: string;
    status: string;
    location: string;
    timestamp: string;
    description: string;
}

interface TrackingResult {
    orderNo: string;
    status: string;
    origin: string;
    destination: string;
    weight: string;
    packages: number;
    description: string;
    customer: string;
    priority: string;
    vehicle?: string;
    driver?: string;
    events: TrackingEvent[];
}

export default function TrackPage() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber.trim()) {
            setError("Please enter an order number");
            return;
        }
        setError("");
        setIsLoading(true);

        try {
            const res = await fetch(`/api/track?orderNo=${encodeURIComponent(trackingNumber.trim())}`);
            if (res.ok) {
                const data = await res.json();
                setTrackingResult(data);
            } else if (res.status === 404) {
                setError("Order not found. Please check and try again.");
                setTrackingResult(null);
            } else {
                setError("Failed to track order. Please try again.");
                setTrackingResult(null);
            }
        } catch {
            setError("Connection error. Please try again.");
            setTrackingResult(null);
        }
        setIsLoading(false);
    };

    const getStatusColor = (status: string) => {
        const s = status.toLowerCase();
        if (s === "delivered" || s === "completed") return "text-green-400 bg-green-500/20";
        if (s === "in_transit" || s === "dispatched") return "text-blue-400 bg-blue-500/20";
        if (s === "departed" || s === "arrived") return "text-purple-400 bg-purple-500/20";
        if (s === "delayed" || s === "breakdown") return "text-orange-400 bg-orange-500/20";
        return "text-slate-400 bg-slate-500/20";
    };

    const getStatusIcon = (status: string) => {
        const s = status.toLowerCase();
        if (s === "delivered" || s === "completed") return <CheckCircle className="w-5 h-5" />;
        if (s === "in_transit" || s === "dispatched") return <Truck className="w-5 h-5" />;
        if (s === "delayed" || s === "breakdown") return <AlertCircle className="w-5 h-5" />;
        return <MapPin className="w-5 h-5" />;
    };

    const formatTimestamp = (ts: string) => {
        const d = new Date(ts);
        return d.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Courier</span>
                        </Link>
                        <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-4">Track Your Package</h1>
                    <p className="text-slate-400">Enter your order number to see real-time updates on your shipment</p>
                </div>

                <form onSubmit={handleTrack} className="mb-10">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Enter order number (e.g., ORD-2024-0001)"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50 flex items-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                                Track
                            </button>
                        </div>
                        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
                        <p className="mt-4 text-slate-500 text-sm text-center">Try: ORD-2024-0001, ORD-2024-0002, ORD-2024-0003</p>
                    </div>
                </form>

                {trackingResult && (
                    <div className="space-y-6">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-slate-400 text-sm">Order Number</p>
                                    <p className="text-2xl font-bold text-white">{trackingResult.orderNo}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(trackingResult.status)}`}>
                                    {trackingResult.status.replace('_', ' ')}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm">Origin</p>
                                            <p className="text-white font-medium">{trackingResult.origin}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm">Destination</p>
                                            <p className="text-white font-medium">{trackingResult.destination}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Package className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-sm">Package Details</p>
                                            <p className="text-white font-medium">{trackingResult.packages} packages • {trackingResult.weight}</p>
                                        </div>
                                    </div>
                                    {trackingResult.driver && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                                <User className="w-5 h-5 text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="text-slate-400 text-sm">Driver</p>
                                                <p className="text-white font-medium">{trackingResult.driver}</p>
                                                {trackingResult.vehicle && <p className="text-slate-400 text-sm">{trackingResult.vehicle}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Tracking History
                            </h2>
                            {trackingResult.events.length === 0 ? (
                                <p className="text-slate-400 text-center py-8">No tracking events yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {trackingResult.events.map((event, index) => (
                                        <div key={event.id} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(event.status)}`}>
                                                    {getStatusIcon(event.status)}
                                                </div>
                                                {index < trackingResult.events.length - 1 && (
                                                    <div className="w-0.5 h-full bg-slate-700 my-2" />
                                                )}
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <p className="text-white font-medium">{event.description}</p>
                                                <p className="text-slate-400 text-sm">{event.location}</p>
                                                <p className="text-slate-500 text-sm">{formatTimestamp(event.timestamp)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
