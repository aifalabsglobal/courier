"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, ArrowLeft, Package, MapPin, Calendar, Clock, CreditCard, CheckCircle } from "lucide-react";

export default function BookPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        // Shipper
        shipperName: "",
        shipperPhone: "",
        shipperAddress: "",
        shipperCity: "",
        shipperState: "",
        shipperZip: "",
        // Recipient
        recipientName: "",
        recipientPhone: "",
        recipientAddress: "",
        recipientCity: "",
        recipientState: "",
        recipientZip: "",
        // Package
        packageType: "parcel",
        weight: "",
        length: "",
        width: "",
        height: "",
        description: "",
        declaredValue: "",
        // Service
        serviceType: "express",
        pickupDate: "",
        insurance: false,
        signature: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const services = [
        { id: "express", name: "Express Delivery", time: "1-2 Days", price: "$25.99" },
        { id: "standard", name: "Standard Delivery", time: "3-5 Days", price: "$12.99" },
        { id: "economy", name: "Economy", time: "7-10 Days", price: "$7.99" },
        { id: "same_day", name: "Same Day", time: "Today", price: "$49.99" },
    ];

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
                    <h1 className="text-4xl font-bold text-white mb-4">Book a Shipment</h1>
                    <p className="text-slate-400">Complete the form below to schedule your pickup</p>
                </div>

                {/* Progress Steps */}
                <div className="flex justify-between mb-10">
                    {[
                        { num: 1, label: "Addresses", icon: MapPin },
                        { num: 2, label: "Package", icon: Package },
                        { num: 3, label: "Service", icon: Clock },
                        { num: 4, label: "Confirm", icon: CheckCircle },
                    ].map((s) => (
                        <div key={s.num} className="flex-1 flex items-center">
                            <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition ${step >= s.num
                                    ? "bg-blue-500 border-blue-500 text-white"
                                    : "border-slate-600 text-slate-500"
                                }`}>
                                <s.icon className="w-5 h-5" />
                            </div>
                            <span className={`ml-3 hidden sm:block ${step >= s.num ? "text-white" : "text-slate-500"}`}>
                                {s.label}
                            </span>
                            {s.num < 4 && (
                                <div className={`flex-1 h-0.5 mx-4 ${step > s.num ? "bg-blue-500" : "bg-slate-700"}`}></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Form Steps */}
                <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                    {/* Step 1: Addresses */}
                    {step === 1 && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-green-400" />
                                    </div>
                                    Pickup Address (Shipper)
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" name="shipperName" placeholder="Full Name" value={formData.shipperName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    <input type="tel" name="shipperPhone" placeholder="Phone Number" value={formData.shipperPhone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    <input type="text" name="shipperAddress" placeholder="Street Address" value={formData.shipperAddress} onChange={handleChange} className="md:col-span-2 w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    <input type="text" name="shipperCity" placeholder="City" value={formData.shipperCity} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="shipperState" placeholder="State" value={formData.shipperState} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                        <input type="text" name="shipperZip" placeholder="ZIP Code" value={formData.shipperZip} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-red-400" />
                                    </div>
                                    Delivery Address (Recipient)
                                </h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <input type="text" name="recipientName" placeholder="Full Name" value={formData.recipientName} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    <input type="tel" name="recipientPhone" placeholder="Phone Number" value={formData.recipientPhone} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    <input type="text" name="recipientAddress" placeholder="Street Address" value={formData.recipientAddress} onChange={handleChange} className="md:col-span-2 w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    <input type="text" name="recipientCity" placeholder="City" value={formData.recipientCity} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" name="recipientState" placeholder="State" value={formData.recipientState} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                        <input type="text" name="recipientZip" placeholder="ZIP Code" value={formData.recipientZip} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Package */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                                    <Package className="w-4 h-4 text-purple-400" />
                                </div>
                                Package Details
                            </h3>

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">Package Type</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {["parcel", "document", "freight"].map((type) => (
                                        <label key={type} className={`flex items-center justify-center p-4 rounded-xl border cursor-pointer transition ${formData.packageType === type ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                                            <input type="radio" name="packageType" value={type} checked={formData.packageType === type} onChange={handleChange} className="sr-only" />
                                            <span className="text-white capitalize">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Weight (kg)</label>
                                    <input type="number" name="weight" placeholder="0.00" value={formData.weight} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Length (cm)</label>
                                    <input type="number" name="length" placeholder="0" value={formData.length} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Width (cm)</label>
                                    <input type="number" name="width" placeholder="0" value={formData.width} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Height (cm)</label>
                                    <input type="number" name="height" placeholder="0" value={formData.height} onChange={handleChange} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">Package Description</label>
                                <textarea name="description" placeholder="Describe the contents of your package" value={formData.description} onChange={handleChange} rows={3} className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">Declared Value ($)</label>
                                <input type="number" name="declaredValue" placeholder="0.00" value={formData.declaredValue} onChange={handleChange} className="w-full md:w-1/2 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500" />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Service */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-blue-400" />
                                </div>
                                Select Service
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {services.map((service) => (
                                    <label key={service.id} className={`flex items-center justify-between p-5 rounded-xl border cursor-pointer transition ${formData.serviceType === service.id ? "border-blue-500 bg-blue-500/10" : "border-slate-600 hover:border-slate-500"}`}>
                                        <div className="flex items-center gap-3">
                                            <input type="radio" name="serviceType" value={service.id} checked={formData.serviceType === service.id} onChange={handleChange} className="sr-only" />
                                            <div className={`w-4 h-4 rounded-full border-2 ${formData.serviceType === service.id ? "border-blue-500 bg-blue-500" : "border-slate-500"}`}></div>
                                            <div>
                                                <div className="text-white font-medium">{service.name}</div>
                                                <div className="text-slate-400 text-sm">{service.time}</div>
                                            </div>
                                        </div>
                                        <div className="text-xl font-bold text-white">{service.price}</div>
                                    </label>
                                ))}
                            </div>

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">Pickup Date</label>
                                <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} className="w-full md:w-1/2 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500" />
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" name="insurance" checked={formData.insurance} onChange={handleChange} className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500" />
                                    <span className="text-white">Add shipping insurance (+$5.99)</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" name="signature" checked={formData.signature} onChange={handleChange} className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500" />
                                    <span className="text-white">Require signature on delivery (+$2.99)</span>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirm */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-10 h-10 text-green-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Review Your Shipment</h3>
                                <p className="text-slate-400">Please confirm all details are correct before submitting</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-700/30 rounded-xl p-5">
                                    <h4 className="text-slate-400 text-sm mb-3">From</h4>
                                    <p className="text-white font-medium">{formData.shipperName || "Not provided"}</p>
                                    <p className="text-slate-400 text-sm">{formData.shipperAddress}, {formData.shipperCity}</p>
                                </div>
                                <div className="bg-slate-700/30 rounded-xl p-5">
                                    <h4 className="text-slate-400 text-sm mb-3">To</h4>
                                    <p className="text-white font-medium">{formData.recipientName || "Not provided"}</p>
                                    <p className="text-slate-400 text-sm">{formData.recipientAddress}, {formData.recipientCity}</p>
                                </div>
                            </div>

                            <div className="bg-slate-700/30 rounded-xl p-5">
                                <h4 className="text-slate-400 text-sm mb-3">Order Summary</h4>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-white">
                                        <span>Service: {services.find(s => s.id === formData.serviceType)?.name}</span>
                                        <span>{services.find(s => s.id === formData.serviceType)?.price}</span>
                                    </div>
                                    {formData.insurance && <div className="flex justify-between text-white"><span>Insurance</span><span>$5.99</span></div>}
                                    {formData.signature && <div className="flex justify-between text-white"><span>Signature Required</span><span>$2.99</span></div>}
                                    <div className="border-t border-slate-600 pt-2 mt-2 flex justify-between text-lg font-bold text-white">
                                        <span>Total</span>
                                        <span>$34.97</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-6 border-t border-slate-700">
                        {step > 1 ? (
                            <button onClick={prevStep} className="px-6 py-3 border border-slate-600 text-white rounded-xl hover:bg-slate-700 transition">
                                Previous
                            </button>
                        ) : (
                            <div></div>
                        )}
                        {step < 4 ? (
                            <button onClick={nextStep} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:opacity-90 transition">
                                Continue
                            </button>
                        ) : (
                            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Proceed to Payment
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
