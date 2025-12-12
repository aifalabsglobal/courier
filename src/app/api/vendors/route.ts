import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const vendors = await db.vendor.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(vendors);
    } catch (error) {
        console.error("[VENDORS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            email,
            phone,
            address,
            city,
            state,
            country,
            taxId,
            status // frontend 'Active'/'Inactive'
        } = body;

        if (!name) {
            return new NextResponse("Name is required", { status: 400 });
        }

        // Ensure company exists
        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({
                data: {
                    name: "Default Company",
                    email: "admin@example.com"
                }
            });
        }

        // Generate simple code
        const code = name.substring(0, 3).toUpperCase() + Math.floor(Math.random() * 1000).toString();

        const vendor = await db.vendor.create({
            data: {
                name,
                email,
                phone,
                address,
                city,
                state,
                country,
                taxId,
                code,
                serviceTypes: "[]", // Default empty JSON array
                isActive: status === "Active",
                companyId: company.id
            }
        });

        return NextResponse.json(vendor);
    } catch (error) {
        console.error("[VENDORS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
