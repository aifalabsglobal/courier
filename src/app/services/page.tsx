import Link from "next/link";
import { Truck, ArrowLeft, Package, Clock, MapPin, Shield, Users, Building, CheckCircle } from "lucide-react";

const services = [
    {
        title: "Express Delivery",
        description: "Need it there fast? Our express delivery service ensures your packages arrive within 1-2 business days. Perfect for time-sensitive documents and urgent shipments.",
        icon: Clock,
        features: ["1-2 business day delivery", "Priority handling", "Real-time tracking", "SMS notifications"],
        color: "from-blue-500 to-cyan-500",
    },
    {
        title: "Same Day Delivery",
        description: "For those urgent moments when tomorrow isn't soon enough. We'll pick up and deliver your package on the same day within city limits.",
        icon: Truck,
        features: ["Pick up within 2 hours", "Delivery by end of day", "Live GPS tracking", "Direct route"],
        color: "from-purple-500 to-pink-500",
    },
    {
        title: "Standard Shipping",
        description: "Our most economical option for non-urgent shipments. Reliable delivery within 3-5 business days at competitive rates.",
        icon: Package,
        features: ["3-5 business day delivery", "Package tracking", "Insurance included", "Cost-effective"],
        color: "from-green-500 to-emerald-500",
    },
    {
        title: "Freight Services",
        description: "Heavy loads? No problem. Our freight division handles everything from pallets to full truckloads with commercial-grade equipment.",
        icon: Building,
        features: ["FTL & LTL options", "Dock-to-dock service", "Commercial equipment", "Nationwide coverage"],
        color: "from-orange-500 to-red-500",
    },
    {
        title: "Last Mile Delivery",
        description: "The final step matters most. We specialize in getting packages from local hubs to doorsteps with efficiency and care.",
        icon: MapPin,
        features: ["Doorstep delivery", "Flexible time windows", "Proof of delivery", "Customer notifications"],
        color: "from-indigo-500 to-violet-500",
    },
    {
        title: "Secure Transport",
        description: "High-value items deserve extra protection. Our secure transport service includes enhanced handling, tracking, and insurance.",
        icon: Shield,
        features: ["Enhanced security", "Chain of custody", "Premium insurance", "White glove handling"],
        color: "from-rose-500 to-pink-500",
    },
];

export default function ServicesPage() {
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

            {/* Hero */}
            <section className="py-20 px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Our Services</h1>
                    <p className="text-xl text-slate-400">
                        From same-day express to freight logistics, we offer comprehensive shipping solutions tailored to your needs.
                    </p>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service) => (
                            <div key={service.title} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 hover:border-slate-600 transition group">
                                <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition`}>
                                    <service.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">{service.title}</h3>
                                <p className="text-slate-400 mb-6">{service.description}</p>
                                <ul className="space-y-2">
                                    {service.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-green-400" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Industries */}
            <section className="py-20 px-4 bg-slate-800/30">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Industries We Serve</h2>
                        <p className="text-slate-400">Specialized logistics solutions for every sector</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {["E-Commerce", "Healthcare", "Manufacturing", "Retail", "Technology", "Automotive", "Food & Beverage", "Pharmaceuticals"].map((industry) => (
                            <div key={industry} className="bg-slate-800/50 rounded-xl p-6 text-center border border-slate-700 hover:border-blue-500/50 transition">
                                <div className="text-white font-medium">{industry}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h2>
                        <p className="text-blue-100 mb-8">
                            Our logistics experts can design a tailored shipping strategy for your business
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition">
                                Contact Sales
                            </Link>
                            <Link href="/rates" className="bg-white/10 text-white px-8 py-3 rounded-xl font-semibold hover:bg-white/20 transition border border-white/20">
                                Get a Quote
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
