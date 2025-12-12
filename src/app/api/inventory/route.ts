import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const inventory = await db.inventory.findMany({
            include: { warehouse: true, location: true, sku: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(inventory);
    } catch (error) {
        console.error("[INVENTORY_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { warehouseId, locationId, skuId, batchNo, lotNo, quantity, status } = body;

        if (!warehouseId || !skuId) return new NextResponse("Warehouse and SKU required", { status: 400 });

        const inv = await db.inventory.create({
            data: {
                warehouseId, locationId, skuId, batchNo, lotNo,
                quantity: parseFloat(quantity) || 0,
                availableQty: parseFloat(quantity) || 0,
                status: status || "AVAILABLE"
            },
            include: { warehouse: true, location: true, sku: true }
        });
        return NextResponse.json(inv);
    } catch (error) {
        console.error("[INVENTORY_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
