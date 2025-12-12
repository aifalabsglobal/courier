import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const warehouses = await db.warehouse.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(warehouses);
    } catch (error) {
        console.error("[WAREHOUSES_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { name, code, address, city, state, country, warehouseType, isActive } = body;

        if (!name) return new NextResponse("Name required", { status: 400 });

        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({ data: { name: "Default Company", email: "admin@example.com" } });
        }

        const warehouse = await db.warehouse.create({
            data: {
                companyId: company.id,
                name, code, address, city, state, country, warehouseType,
                isActive: isActive ?? true
            }
        });
        return NextResponse.json(warehouse);
    } catch (error) {
        console.error("[WAREHOUSES_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
