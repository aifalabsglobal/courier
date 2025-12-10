import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const customers = await db.customer.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(customers);
    } catch (error) {
        console.error("[CUSTOMERS_GET]", error);
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

        const customer = await db.customer.create({
            data: {
                name,
                email,
                phone,
                address,
                city,
                state,
                country,
                code,
                isActive: status === "Active",
                companyId: company.id
            }
        });

        return NextResponse.json(customer);
    } catch (error) {
        console.error("[CUSTOMERS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
