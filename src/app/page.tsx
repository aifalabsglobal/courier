"use client";

import Link from "next/link";
import { Package, Truck, MapPin, Clock, Shield, Phone, ArrowRight, Search } from "lucide-react";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Courier</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/track" className="text-slate-300 hover:text-white transition">Track Package</Link>
              <Link href="/services" className="text-slate-300 hover:text-white transition">Services</Link>
              <Link href="/rates" className="text-slate-300 hover:text-white transition">Rates</Link>
              <Link href="/about" className="text-slate-300 hover:text-white transition">About</Link>
              <Link href="/contact" className="text-slate-300 hover:text-white transition">Contact</Link>
              <Link href="/docs" className="text-slate-300 hover:text-white transition">Docs</Link>
            </div>
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-slate-300 hover:text-white transition">Login</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard" className="text-slate-300 hover:text-white transition">Dashboard</Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-9 w-9",
                    }
                  }}
                />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-blue-400 text-sm">Delivering across 50+ cities</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Fast & Reliable
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Courier Services
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            From same-day deliveries to international freight, we handle your packages with care and precision. Track in real-time, every step of the way.
          </p>

          {/* Quick Track Form */}
          <div className="max-w-xl mx-auto bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
            <h3 className="text-white font-medium mb-4">Track Your Package</h3>
            <form action="/track" method="GET" className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="tracking"
                  placeholder="Enter tracking number (e.g., TRK-2024-001)"
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
              <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2">
                Track
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            {[
              { value: "50K+", label: "Packages Delivered" },
              { value: "99.9%", label: "On-Time Delivery" },
              { value: "500+", label: "Fleet Vehicles" },
              { value: "24/7", label: "Customer Support" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Services</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Comprehensive logistics solutions tailored to your business needs
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: "Express Delivery",
                description: "Same-day and next-day delivery options for urgent shipments. Get your packages delivered in hours, not days.",
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: Truck,
                title: "Freight Services",
                description: "Full truckload (FTL) and less-than-truckload (LTL) options for commercial cargo of any size.",
                color: "from-purple-500 to-pink-500",
              },
              {
                icon: MapPin,
                title: "Last Mile Delivery",
                description: "Efficient final-leg delivery solutions with real-time tracking and proof of delivery.",
                color: "from-orange-500 to-red-500",
              },
            ].map((service) => (
              <div key={service.title} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition group">
                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                  <service.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                <p className="text-slate-400">{service.description}</p>
                <Link href="/services" className="inline-flex items-center gap-2 text-blue-400 mt-4 hover:text-blue-300 transition">
                  Learn more <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Why Choose Courier?
              </h2>
              <div className="space-y-6">
                {[
                  { icon: Clock, title: "Real-Time Tracking", description: "Know exactly where your package is at every moment with GPS-enabled tracking." },
                  { icon: Shield, title: "Secure & Insured", description: "All shipments are fully insured and handled with utmost care and security." },
                  { icon: Phone, title: "24/7 Support", description: "Our customer support team is available around the clock to assist you." },
                ].map((feature) => (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{feature.title}</h3>
                      <p className="text-slate-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Package Delivered</div>
                        <div className="text-slate-400 text-sm">TRK-2024-001</div>
                      </div>
                    </div>
                    <span className="text-green-400 text-sm">2 min ago</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Truck className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Out for Delivery</div>
                        <div className="text-slate-400 text-sm">TRK-2024-002</div>
                      </div>
                    </div>
                    <span className="text-blue-400 text-sm">In Transit</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">Arrived at Hub</div>
                        <div className="text-slate-400 text-sm">TRK-2024-003</div>
                      </div>
                    </div>
                    <span className="text-purple-400 text-sm">Dallas DC</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Ship?
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Get started with Courier today. Book your first shipment and experience the difference of reliable logistics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/book" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
                Book Shipment
              </Link>
              <Link href="/rates" className="bg-white/10 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition border border-white/20">
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Courier</span>
              </div>
              <p className="text-slate-400 text-sm">
                Fast, reliable, and secure logistics solutions for businesses of all sizes.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link href="/track" className="block text-slate-400 hover:text-white transition text-sm">Track Package</Link>
                <Link href="/book" className="block text-slate-400 hover:text-white transition text-sm">Book Shipment</Link>
                <Link href="/rates" className="block text-slate-400 hover:text-white transition text-sm">Rate Calculator</Link>
                <Link href="/services" className="block text-slate-400 hover:text-white transition text-sm">Services</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-slate-400 hover:text-white transition text-sm">About Us</Link>
                <Link href="/contact" className="block text-slate-400 hover:text-white transition text-sm">Contact</Link>
                <Link href="/careers" className="block text-slate-400 hover:text-white transition text-sm">Careers</Link>
                <Link href="/blog" className="block text-slate-400 hover:text-white transition text-sm">Blog</Link>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-slate-400 text-sm">
                <p>1-800-COURIER</p>
                <p>support@courier.com</p>
                <p>123 Logistics Way<br />Dallas, TX 75201</p>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2024 Courier by AIFA Labs Global. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-slate-500 hover:text-white transition text-sm">Privacy Policy</Link>
              <Link href="/terms" className="text-slate-500 hover:text-white transition text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}