"use client";

import { useState } from "react";
import Link from "next/link";
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle, Search, ArrowLeft } from "lucide-react";

interface TrackingEvent {
    id: string;
    status: string;
    location: string;
    timestamp: string;
    description: string;
}

const mockTracking = {
    trackingNumber: "TRK-2024-001",
    status: "in_transit",
    origin: "Dallas, TX",
    destination: "Houston, TX",
    estimatedDelivery: "Dec 10, 2024",
    weight: "15.5 kg",
    service: "Express Delivery",
    shipper: "Acme Corporation",
    recipient: "John Smith",
    events: [
        { id: "1", status: "in_transit", location: "Austin, TX - Distribution Center", timestamp: "Dec 9, 2024 - 2:30 PM", description: "Package in transit to destination" },
        { id: "2", status: "departed", location: "Dallas, TX - Hub", timestamp: "Dec 9, 2024 - 8:00 AM", description: "Departed from Dallas facility" },
        { id: "3", status: "processed", location: "Dallas, TX - Hub", timestamp: "Dec 8, 2024 - 6:45 PM", description: "Package processed and sorted" },
        { id: "4", status: "received", location: "Dallas, TX - Pickup Center", timestamp: "Dec 8, 2024 - 4:00 PM", description: "Package received at origin facility" },
        { id: "5", status: "picked_up", location: "Dallas, TX", timestamp: "Dec 8, 2024 - 2:30 PM", description: "Package picked up from shipper" },
    ] as TrackingEvent[],
};

export default function TrackPage() {
    const [trackingNumber, setTrackingNumber] = useState("");
    const [trackingResult, setTrackingResult] = useState<typeof mockTracking | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!trackingNumber.trim()) {
            setError("Please enter a tracking number");
            return;
        }
        setError("");
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // For demo, show mock data for any tracking number starting with TRK
        if (trackingNumber.toUpperCase().startsWith("TRK")) {
            setTrackingResult({ ...mockTracking, trackingNumber: trackingNumber.toUpperCase() });
        } else {
            setError("Tracking number not found. Please check and try again.");
            setTrackingResult(null);
        }
        setIsLoading(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "delivered": return "text-green-400 bg-green-500/20";
            case "in_transit": return "text-blue-400 bg-blue-500/20";
            case "departed": return "text-purple-400 bg-purple-500/20";
            default: return "text-slate-400 bg-slate-500/20";
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
            {/* Navigation */}
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
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-white mb-4">Track Your Package</h1>
                    <p className="text-slate-400">Enter your tracking number to see real-time updates on your shipment</p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleTrack} className="mb-10">
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                        <div className="flex gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    placeholder="Enter tracking number (e.g., TRK-2024-001)"
                                    className="w-full pl-12 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition text-lg"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50"
                            >
                                {isLoading ? "Tracking..." : "Track"}
                            </button>
                        </div>
                        {error && (
                            <div className="mt-4 flex items-center gap-2 text-red-400">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                    </div>
                </form>

                {/* Tracking Result */}
                {trackingResult && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        {/* Status Card */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="text-slate-400 text-sm mb-1">Tracking Number</div>
                                    <div className="text-2xl font-bold text-white">{trackingResult.trackingNumber}</div>
                                </div>
                                <div className={`px-4 py-2 rounded-full ${getStatusColor(trackingResult.status)} font-medium`}>
                                    {trackingResult.status === "in_transit" ? "In Transit" : trackingResult.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <div className="text-slate-400 text-sm mb-1">From</div>
                                    <div className="text-white font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-400" />
                                        {trackingResult.origin}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-sm mb-1">To</div>
                                    <div className="text-white font-medium flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-red-400" />
                                        {trackingResult.destination}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-sm mb-1">Est. Delivery</div>
                                    <div className="text-white font-medium flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-400" />
                                        {trackingResult.estimatedDelivery}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-sm mb-1">Service</div>
                                    <div className="text-white font-medium flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-purple-400" />
                                        {trackingResult.service}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipment Details */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                            <h3 className="text-lg font-semibold text-white mb-4">Shipment Details</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-700/30 rounded-xl p-4">
                                    <div className="text-slate-400 text-sm">Weight</div>
                                    <div className="text-white font-medium">{trackingResult.weight}</div>
                                </div>
                                <div className="bg-slate-700/30 rounded-xl p-4">
                                    <div className="text-slate-400 text-sm">Shipper</div>
                                    <div className="text-white font-medium">{trackingResult.shipper}</div>
                                </div>
                                <div className="bg-slate-700/30 rounded-xl p-4">
                                    <div className="text-slate-400 text-sm">Recipient</div>
                                    <div className="text-white font-medium">{trackingResult.recipient}</div>
                                </div>
                                <div className="bg-slate-700/30 rounded-xl p-4">
                                    <div className="text-slate-400 text-sm">Service Type</div>
                                    <div className="text-white font-medium">{trackingResult.service}</div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                            <h3 className="text-lg font-semibold text-white mb-6">Tracking History</h3>
                            <div className="space-y-0">
                                {trackingResult.events.map((event, index) => (
                                    <div key={event.id} className="flex gap-4">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 0 ? "bg-blue-500" : "bg-slate-700"}`}>
                                                {index === 0 ? (
                                                    <Truck className="w-5 h-5 text-white" />
                                                ) : (
                                                    <CheckCircle className="w-5 h-5 text-slate-400" />
                                                )}
                                            </div>
                                            {index < trackingResult.events.length - 1 && (
                                                <div className="w-0.5 h-16 bg-slate-700"></div>
                                            )}
                                        </div>
                                        <div className="pb-8">
                                            <div className="text-white font-medium">{event.description}</div>
                                            <div className="text-slate-400 text-sm">{event.location}</div>
                                            <div className="text-slate-500 text-sm">{event.timestamp}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Demo Box */}
                {!trackingResult && (
                    <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700 text-center">
                        <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-400 mb-2">Demo Tracking Numbers</h3>
                        <p className="text-slate-500 text-sm mb-4">Try these sample tracking numbers:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {["TRK-2024-001", "TRK-2024-002", "TRK-2024-003"].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => setTrackingNumber(num)}
                                    className="px-4 py-2 bg-slate-700/50 rounded-lg text-slate-300 hover:bg-slate-700 transition text-sm font-mono"
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
