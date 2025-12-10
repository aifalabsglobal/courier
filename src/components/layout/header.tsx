"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search orders, customers, vehicles..."
              className="pl-10 w-96"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9",
                  userButtonPopoverCard: "shadow-xl",
                  userButtonPopoverActionButton: "hover:bg-gray-100",
                }
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}