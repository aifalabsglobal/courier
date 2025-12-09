"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, ArrowLeft, Calculator, Package, MapPin, ArrowRight } from "lucide-react";

export default function RatesPage() {
    const [formData, setFormData] = useState({
        origin: "",
        destination: "",
        weight: "",
        length: "",
        width: "",
        height: "",
        packageType: "parcel",
    });
    const [quote, setQuote] = useState<null | { service: string; price: number; time: string }[]>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const calculateRate = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate rate calculation
        const baseRate = parseFloat(formData.weight) || 1;
        setQuote([
            { service: "Same Day Delivery", price: Math.round(baseRate * 3.5 * 100) / 100 + 15, time: "Today" },
            { service: "Express Delivery", price: Math.round(baseRate * 2.2 * 100) / 100 + 8, time: "1-2 Days" },
            { service: "Standard Delivery", price: Math.round(baseRate * 1.5 * 100) / 100 + 5, time: "3-5 Days" },
            { service: "Economy", price: Math.round(baseRate * 0.9 * 100) / 100 + 3, time: "7-10 Days" },
        ]);
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

            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-4">
                        <Calculator className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm">Instant Rate Calculator</span>
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">Get a Shipping Quote</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Enter your shipment details below to get instant pricing for all our delivery options
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Calculator Form */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                        <form onSubmit={calculateRate} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Origin City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" />
                                        <input
                                            type="text"
                                            name="origin"
                                            value={formData.origin}
                                            onChange={handleChange}
                                            placeholder="e.g., Dallas, TX"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Destination City</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                                        <input
                                            type="text"
                                            name="destination"
                                            value={formData.destination}
                                            onChange={handleChange}
                                            placeholder="e.g., Houston, TX"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">Package Type</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {["parcel", "document", "freight"].map((type) => (
                                        <label
                                            key={type}
                                            className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition ${formData.packageType === type
                                                    ? "border-blue-500 bg-blue-500/10 text-white"
                                                    : "border-slate-600 text-slate-400 hover:border-slate-500"
                                                }`}
                                        >
                                            <input type="radio" name="packageType" value={type} checked={formData.packageType === type} onChange={handleChange} className="sr-only" />
                                            <Package className="w-4 h-4 mr-2" />
                                            <span className="capitalize">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">Weight (kg)</label>
                                <input
                                    type="number"
                                    name="weight"
                                    value={formData.weight}
                                    onChange={handleChange}
                                    placeholder="Enter weight"
                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Length (cm)</label>
                                    <input type="number" name="length" value={formData.length} onChange={handleChange} placeholder="0" className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Width (cm)</label>
                                    <input type="number" name="width" value={formData.width} onChange={handleChange} placeholder="0" className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Height (cm)</label>
                                    <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="0" className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                            >
                                <Calculator className="w-5 h-5" />
                                Calculate Rate
                            </button>
                        </form>
                    </div>

                    {/* Quote Results */}
                    <div className="space-y-6">
                        {quote ? (
                            <>
                                <h3 className="text-lg font-semibold text-white">Available Services</h3>
                                <div className="space-y-4">
                                    {quote.map((q) => (
                                        <div key={q.service} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 hover:border-blue-500/50 transition group">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="text-white font-medium text-lg">{q.service}</div>
                                                    <div className="text-slate-400 text-sm">Estimated: {q.time}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-white">${q.price.toFixed(2)}</div>
                                                    <Link href="/book" className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition opacity-0 group-hover:opacity-100">
                                                        Book Now <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-slate-500 text-sm">
                                    * Rates shown are estimates. Final price may vary based on actual weight and dimensions measured at pickup.
                                </p>
                            </>
                        ) : (
                            <div className="bg-slate-800/30 rounded-xl p-12 border border-slate-700 text-center h-full flex flex-col items-center justify-center">
                                <Calculator className="w-16 h-16 text-slate-600 mb-4" />
                                <h3 className="text-xl font-medium text-slate-400 mb-2">Enter Shipment Details</h3>
                                <p className="text-slate-500">Fill out the form to see available rates</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pricing Tiers */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-white text-center mb-8">Our Pricing Tiers</h2>
                    <div className="grid md:grid-cols-4 gap-6">
                        {[
                            { name: "Economy", price: "From $7.99", desc: "7-10 business days", features: ["Basic tracking", "No signature required", "Standard insurance"] },
                            { name: "Standard", price: "From $12.99", desc: "3-5 business days", features: ["Full tracking", "Delivery confirmation", "Standard insurance"] },
                            { name: "Express", price: "From $25.99", desc: "1-2 business days", features: ["Priority handling", "SMS updates", "Enhanced insurance"], popular: true },
                            { name: "Same Day", price: "From $49.99", desc: "Same day delivery", features: ["Fastest delivery", "Real-time tracking", "Premium insurance"] },
                        ].map((tier) => (
                            <div key={tier.name} className={`bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border ${tier.popular ? "border-blue-500 ring-2 ring-blue-500/20" : "border-slate-700"} relative`}>
                                {tier.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-xl font-semibold text-white mb-2">{tier.name}</h3>
                                <div className="text-2xl font-bold text-white mb-1">{tier.price}</div>
                                <div className="text-slate-400 text-sm mb-4">{tier.desc}</div>
                                <ul className="space-y-2">
                                    {tier.features.map((f) => (
                                        <li key={f} className="text-slate-400 text-sm flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                            {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
