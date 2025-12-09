"use client";

import { useState } from "react";
import Link from "next/link";
import { Truck, ArrowLeft, Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle } from "lucide-react";

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate form submission
        setIsSubmitted(true);
    };

    const contactInfo = [
        { icon: Phone, title: "Phone", value: "1-800-COURIER", subtext: "Mon-Fri 8am-8pm EST" },
        { icon: Mail, title: "Email", value: "support@courier.com", subtext: "We reply within 24 hours" },
        { icon: MapPin, title: "Headquarters", value: "123 Logistics Way", subtext: "Dallas, TX 75201" },
        { icon: Clock, title: "Business Hours", value: "Mon - Fri: 8am - 8pm", subtext: "Sat: 9am - 5pm" },
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

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contact Us</h1>
                    <p className="text-xl text-slate-400 max-w-xl mx-auto">
                        Have questions? We&apos;re here to help. Reach out to us through any of the channels below.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="space-y-4">
                        {contactInfo.map((info) => (
                            <div key={info.title} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <info.icon className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <div className="text-slate-400 text-sm">{info.title}</div>
                                    <div className="text-white font-medium">{info.value}</div>
                                    <div className="text-slate-500 text-sm">{info.subtext}</div>
                                </div>
                            </div>
                        ))}

                        {/* Quick Links */}
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700">
                            <h3 className="text-white font-medium mb-4">Quick Links</h3>
                            <div className="space-y-2">
                                <Link href="/track" className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm">
                                    <MessageSquare className="w-4 h-4" /> Track a Package
                                </Link>
                                <Link href="/rates" className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm">
                                    <MessageSquare className="w-4 h-4" /> Get a Quote
                                </Link>
                                <Link href="/services" className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm">
                                    <MessageSquare className="w-4 h-4" /> Our Services
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
                            {isSubmitted ? (
                                <div className="text-center py-12">
                                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-10 h-10 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-slate-400 mb-6">
                                        Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setIsSubmitted(false)}
                                        className="text-blue-400 hover:text-blue-300 transition"
                                    >
                                        Send another message
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                                    <form onSubmit={handleSubmit} className="space-y-5">
                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-slate-400 text-sm mb-2 block">Full Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="John Smith"
                                                    required
                                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-slate-400 text-sm mb-2 block">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    placeholder="john@example.com"
                                                    required
                                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-5">
                                            <div>
                                                <label className="text-slate-400 text-sm mb-2 block">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    placeholder="+1 (555) 000-0000"
                                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-slate-400 text-sm mb-2 block">Subject</label>
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-blue-500"
                                                >
                                                    <option value="">Select a subject</option>
                                                    <option value="general">General Inquiry</option>
                                                    <option value="support">Customer Support</option>
                                                    <option value="sales">Sales & Pricing</option>
                                                    <option value="partnership">Business Partnership</option>
                                                    <option value="feedback">Feedback</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="text-slate-400 text-sm mb-2 block">Message</label>
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                placeholder="How can we help you?"
                                                rows={5}
                                                required
                                                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-medium hover:opacity-90 transition flex items-center justify-center gap-2"
                                        >
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </button>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="mt-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 text-center">
                    <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Visit Our Office</h3>
                    <p className="text-slate-400">123 Logistics Way, Dallas, TX 75201</p>
                    <p className="text-slate-500 text-sm mt-2">Monday - Friday: 8:00 AM - 6:00 PM</p>
                </div>
            </div>
        </div>
    );
}
