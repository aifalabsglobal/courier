import Link from "next/link";
import { Truck, ArrowLeft, Target, Users, Globe, Award, TrendingUp, Heart } from "lucide-react";

const stats = [
    { value: "50K+", label: "Packages Delivered Monthly" },
    { value: "500+", label: "Fleet Vehicles" },
    { value: "50+", label: "Cities Covered" },
    { value: "99.9%", label: "On-Time Delivery Rate" },
];

const values = [
    { icon: Target, title: "Reliability", description: "We deliver on our promises, every single time. Our commitment to punctuality is unwavering." },
    { icon: Users, title: "Customer First", description: "Your satisfaction drives everything we do. We listen, adapt, and exceed expectations." },
    { icon: Globe, title: "Sustainability", description: "We're committed to reducing our carbon footprint through eco-friendly practices and green fleet initiatives." },
    { icon: Heart, title: "Integrity", description: "We handle every package with care and conduct our business with complete transparency." },
];

const milestones = [
    { year: "2015", title: "Founded", description: "Started with 5 vehicles in Dallas, TX" },
    { year: "2017", title: "Regional Expansion", description: "Expanded to cover all of Texas" },
    { year: "2019", title: "Technology Upgrade", description: "Launched real-time GPS tracking platform" },
    { year: "2021", title: "National Coverage", description: "Operations in 30+ states" },
    { year: "2023", title: "Fleet Milestone", description: "500+ vehicles in our fleet" },
    { year: "2024", title: "Digital Transformation", description: "AI-powered logistics optimization" },
];

export default function AboutPage() {
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
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About Courier</h1>
                    <p className="text-xl text-slate-400">
                        We&apos;re on a mission to revolutionize logistics by making fast, reliable shipping accessible to everyone. Since 2015, we&apos;ve been connecting businesses and people through seamless delivery solutions.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-slate-400">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-20 px-4 bg-slate-800/30">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
                            <div className="space-y-4 text-slate-400">
                                <p>
                                    Courier was born from a simple idea: shipping shouldn&apos;t be complicated. In 2015, our founders experienced firsthand the frustrations of unreliable delivery services and decided to build something better.
                                </p>
                                <p>
                                    Starting with just five vehicles and a handful of dedicated team members, we set out to create a logistics company that prioritizes reliability, transparency, and customer satisfaction above all else.
                                </p>
                                <p>
                                    Today, we&apos;ve grown into a nationwide operation with over 500 vehicles, serving thousands of customers across 50+ cities. But our core values remain unchanged: deliver on time, every time, and treat every package as if it were our own.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl"></div>
                            <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700">
                                <Award className="w-16 h-16 text-blue-400 mb-6" />
                                <h3 className="text-2xl font-bold text-white mb-2">Award-Winning Service</h3>
                                <p className="text-slate-400">
                                    Recognized as &quot;Best Logistics Provider&quot; by Supply Chain Excellence Awards 2023
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-20 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Our Values</h2>
                        <p className="text-slate-400">The principles that guide everything we do</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value) => (
                            <div key={value.title} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700 text-center">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-white mb-2">{value.title}</h3>
                                <p className="text-slate-400 text-sm">{value.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline */}
            <section className="py-20 px-4 bg-slate-800/30">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">Our Journey</h2>
                        <p className="text-slate-400">Key milestones in our growth</p>
                    </div>
                    <div className="space-y-8">
                        {milestones.map((milestone, index) => (
                            <div key={milestone.year} className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {milestone.year.slice(2)}
                                    </div>
                                    {index < milestones.length - 1 && <div className="w-0.5 h-full bg-slate-700 my-2"></div>}
                                </div>
                                <div className="pb-8">
                                    <div className="text-blue-400 text-sm font-medium">{milestone.year}</div>
                                    <h3 className="text-xl font-semibold text-white">{milestone.title}</h3>
                                    <p className="text-slate-400">{milestone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <TrendingUp className="w-12 h-12 text-blue-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-white mb-4">Join Our Growing Team</h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        We&apos;re always looking for talented individuals who share our passion for excellence. Check out our open positions.
                    </p>
                    <Link href="/careers" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition">
                        View Careers
                    </Link>
                </div>
            </section>
        </div>
    );
}
