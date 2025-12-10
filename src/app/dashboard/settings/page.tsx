"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Building, Bell, Shield, Palette, Save, Globe, Mail } from "lucide-react";

export default function SettingsPage() {
    const [companySettings, setCompanySettings] = useState({
        name: "Courier Logistics Inc.",
        email: "info@courier.com",
        phone: "1-800-COURIER",
        address: "123 Logistics Way, Dallas, TX 75201",
        website: "https://courier.com",
        taxId: "12-3456789",
    });

    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        smsAlerts: false,
        orderUpdates: true,
        maintenanceAlerts: true,
        lowStockAlerts: true,
        dailyReports: false,
    });

    const [preferences, setPreferences] = useState({
        darkMode: false,
        compactView: false,
        timezone: "America/Chicago",
        currency: "USD",
        dateFormat: "MM/DD/YYYY",
        language: "English",
    });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-600">Manage your application settings and preferences</p>
            </div>

            <Tabs defaultValue="company" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
                    <TabsTrigger value="company" className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        Company
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        Preferences
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="company">
                    <Card>
                        <CardHeader>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>Update your company details and contact information.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Company Name</Label>
                                    <Input value={companySettings.name} onChange={(e) => setCompanySettings({ ...companySettings, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Tax ID</Label>
                                    <Input value={companySettings.taxId} onChange={(e) => setCompanySettings({ ...companySettings, taxId: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input type="email" value={companySettings.email} onChange={(e) => setCompanySettings({ ...companySettings, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input value={companySettings.phone} onChange={(e) => setCompanySettings({ ...companySettings, phone: e.target.value })} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Address</Label>
                                    <Input value={companySettings.address} onChange={(e) => setCompanySettings({ ...companySettings, address: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Website</Label>
                                    <Input value={companySettings.website} onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })} />
                                </div>
                            </div>
                            <Button><Save className="h-4 w-4 mr-2" />Save Changes</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>Configure how you receive alerts and updates.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Email Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                                    </div>
                                    <Switch checked={notifications.emailAlerts} onCheckedChange={(checked) => setNotifications({ ...notifications, emailAlerts: checked })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>SMS Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                                    </div>
                                    <Switch checked={notifications.smsAlerts} onCheckedChange={(checked) => setNotifications({ ...notifications, smsAlerts: checked })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Order Updates</Label>
                                        <p className="text-sm text-muted-foreground">Get notified on order status changes</p>
                                    </div>
                                    <Switch checked={notifications.orderUpdates} onCheckedChange={(checked) => setNotifications({ ...notifications, orderUpdates: checked })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Maintenance Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Vehicle maintenance reminders</p>
                                    </div>
                                    <Switch checked={notifications.maintenanceAlerts} onCheckedChange={(checked) => setNotifications({ ...notifications, maintenanceAlerts: checked })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Low Stock Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Inventory low stock warnings</p>
                                    </div>
                                    <Switch checked={notifications.lowStockAlerts} onCheckedChange={(checked) => setNotifications({ ...notifications, lowStockAlerts: checked })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Daily Reports</Label>
                                        <p className="text-sm text-muted-foreground">Receive daily summary reports</p>
                                    </div>
                                    <Switch checked={notifications.dailyReports} onCheckedChange={(checked) => setNotifications({ ...notifications, dailyReports: checked })} />
                                </div>
                            </div>
                            <Button><Save className="h-4 w-4 mr-2" />Save Preferences</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preferences">
                    <Card>
                        <CardHeader>
                            <CardTitle>Display Preferences</CardTitle>
                            <CardDescription>Customize the application appearance and behavior.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label>Timezone</Label>
                                    <select className="w-full px-3 py-2 border rounded-md" value={preferences.timezone} onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}>
                                        <option value="America/New_York">Eastern Time</option>
                                        <option value="America/Chicago">Central Time</option>
                                        <option value="America/Denver">Mountain Time</option>
                                        <option value="America/Los_Angeles">Pacific Time</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Currency</Label>
                                    <select className="w-full px-3 py-2 border rounded-md" value={preferences.currency} onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date Format</Label>
                                    <select className="w-full px-3 py-2 border rounded-md" value={preferences.dateFormat} onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}>
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <select className="w-full px-3 py-2 border rounded-md" value={preferences.language} onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}>
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-4 pt-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Dark Mode</Label>
                                        <p className="text-sm text-muted-foreground">Use dark theme</p>
                                    </div>
                                    <Switch checked={preferences.darkMode} onCheckedChange={(checked) => setPreferences({ ...preferences, darkMode: checked })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Compact View</Label>
                                        <p className="text-sm text-muted-foreground">Show more items in tables</p>
                                    </div>
                                    <Switch checked={preferences.compactView} onCheckedChange={(checked) => setPreferences({ ...preferences, compactView: checked })} />
                                </div>
                            </div>
                            <Button><Save className="h-4 w-4 mr-2" />Save Preferences</Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your account security and authentication.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="p-4 border rounded-lg space-y-3">
                                    <h4 className="font-medium">Change Password</h4>
                                    <div className="space-y-2">
                                        <Label>Current Password</Label>
                                        <Input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>New Password</Label>
                                        <Input type="password" placeholder="••••••••" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Confirm New Password</Label>
                                        <Input type="password" placeholder="••••••••" />
                                    </div>
                                    <Button>Update Password</Button>
                                </div>
                                <div className="p-4 border rounded-lg space-y-3">
                                    <h4 className="font-medium">Two-Factor Authentication</h4>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                                    <Button variant="outline">Enable 2FA</Button>
                                </div>
                                <div className="p-4 border rounded-lg space-y-3">
                                    <h4 className="font-medium">Active Sessions</h4>
                                    <p className="text-sm text-muted-foreground">Manage your logged-in devices.</p>
                                    <Button variant="outline">View Sessions</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
