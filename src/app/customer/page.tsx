"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, ArrowLeft, Package, MapPin, Clock, User, LogIn, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function CustomerPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Redirect to dashboard for demo
        window.location.href = "/dashboard";
    };

    const recentShipments = [
        { id: "TRK-2024-156", origin: "Dallas, TX", destination: "Houston, TX", status: "Delivered", date: "Dec 8, 2024" },
        { id: "TRK-2024-142", origin: "Los Angeles, CA", destination: "San Diego, CA", status: "In Transit", date: "Dec 9, 2024" },
        { id: "TRK-2024-128", origin: "Chicago, IL", destination: "Detroit, MI", status: "Processing", date: "Dec 9, 2024" },
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

            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Login/Register Form */}
                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {isLogin ? "Customer Login" : "Create Account"}
                                </h2>
                                <p className="text-slate-400 text-sm">
                                    {isLogin ? "Access your shipments and account" : "Start shipping with Courier today"}
                                </p>
                            </div>
                        </div>

                        {/* Toggle */}
                        <div className="flex bg-slate-700/50 rounded-xl p-1 mb-8">
                            <button
                                onClick={() => setIsLogin(true)}
                                className={`flex-1 py-2.5 rounded-lg font-medium transition ${isLogin ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setIsLogin(false)}
                                className={`flex-1 py-2.5 rounded-lg font-medium transition ${!isLogin ? "bg-blue-500 text-white" : "text-slate-400 hover:text-white"
                                    }`}
                            >
                                Register
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {!isLogin && (
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Smith"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-slate-400 text-sm mb-2 block">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div>
                                    <label className="text-slate-400 text-sm mb-2 block">Confirm Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            placeholder="••••••••"
                                            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-blue-500" />
                                        <span className="text-slate-400 text-sm">Remember me</span>
                                    </label>
                                    <Link href="/forgot-password" className="text-blue-400 text-sm hover:text-blue-300">
                                        Forgot password?
                                    </Link>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                            >
                                <LogIn className="w-5 h-5" />
                                {isLogin ? "Sign In" : "Create Account"}
                            </button>
                        </form>

                        {isLogin && (
                            <div className="mt-6 text-center">
                                <p className="text-slate-400 text-sm">
                                    Don&apos;t have an account?{" "}
                                    <button onClick={() => setIsLogin(false)} className="text-blue-400 hover:text-blue-300">
                                        Register now
                                    </button>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Info Panel */}
                    <div className="space-y-6">
                        {/* Quick Track */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-400" />
                                Quick Track
                            </h3>
                            <p className="text-slate-400 text-sm mb-4">
                                Don&apos;t have an account? You can still track your package:
                            </p>
                            <Link
                                href="/track"
                                className="block w-full text-center bg-slate-700/50 border border-slate-600 text-white py-3 rounded-xl hover:bg-slate-700 transition"
                            >
                                Track Without Login
                            </Link>
                        </div>

                        {/* Benefits */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                            <h3 className="text-lg font-semibold text-white mb-4">Customer Portal Benefits</h3>
                            <ul className="space-y-3">
                                {[
                                    { icon: Package, text: "View all your shipments in one place" },
                                    { icon: MapPin, text: "Save addresses for faster booking" },
                                    { icon: Clock, text: "Access shipment history anytime" },
                                    { icon: User, text: "Manage your account settings" },
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-400">
                                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="text-sm">{item.text}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Demo Shipments Preview */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                            <h3 className="text-lg font-semibold text-white mb-4">Demo: Recent Shipments</h3>
                            <div className="space-y-3">
                                {recentShipments.map((shipment) => (
                                    <div key={shipment.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                                        <div>
                                            <div className="text-white font-medium text-sm">{shipment.id}</div>
                                            <div className="text-slate-500 text-xs">
                                                {shipment.origin} → {shipment.destination}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs font-medium ${shipment.status === "Delivered" ? "text-green-400" :
                                                    shipment.status === "In Transit" ? "text-blue-400" : "text-yellow-400"
                                                }`}>
                                                {shipment.status}
                                            </div>
                                            <div className="text-slate-500 text-xs">{shipment.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
