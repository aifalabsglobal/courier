"use client";

import Link from "next/link";
import { Truck, ArrowLeft, Package, MapPin, Clock, User } from "lucide-react";
import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function CustomerPage() {
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
                    {/* Clerk Sign In */}
                    <div className="flex flex-col items-center">
                        <SignedOut>
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 w-full max-w-md">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                                        <User className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Customer Portal</h2>
                                        <p className="text-slate-400 text-sm">Sign in to manage your shipments</p>
                                    </div>
                                </div>
                                <SignIn
                                    appearance={{
                                        elements: {
                                            rootBox: "w-full",
                                            card: "bg-transparent shadow-none p-0",
                                            headerTitle: "hidden",
                                            headerSubtitle: "hidden",
                                            socialButtonsBlockButton: "bg-slate-700 border-slate-600 text-white hover:bg-slate-600",
                                            formFieldInput: "bg-slate-700/50 border-slate-600 text-white",
                                            formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90",
                                            footerActionLink: "text-blue-400 hover:text-blue-300",
                                            identityPreviewEditButton: "text-blue-400",
                                        }
                                    }}
                                    routing="hash"
                                    signUpUrl="/sign-up"
                                    redirectUrl="/dashboard"
                                />
                            </div>
                        </SignedOut>

                        <SignedIn>
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 w-full max-w-md text-center">
                                <div className="flex flex-col items-center gap-4 mb-6">
                                    <UserButton
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "h-20 w-20",
                                            }
                                        }}
                                    />
                                    <h2 className="text-2xl font-bold text-white">Welcome Back!</h2>
                                    <p className="text-slate-400">You are signed in to your account.</p>
                                </div>
                                <div className="space-y-3">
                                    <Link
                                        href="/dashboard"
                                        className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition text-center"
                                    >
                                        Go to Dashboard
                                    </Link>
                                    <Link
                                        href="/track"
                                        className="block w-full bg-slate-700/50 border border-slate-600 text-white py-3 rounded-xl hover:bg-slate-700 transition text-center"
                                    >
                                        Track a Package
                                    </Link>
                                </div>
                            </div>
                        </SignedIn>
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
