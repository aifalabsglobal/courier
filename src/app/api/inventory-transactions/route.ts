import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const transactions = await db.inventoryTransaction.findMany({
            include: { warehouse: true, location: true, sku: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(transactions);
    } catch (error) {
        console.error("[TRANSACTIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { warehouseId, locationId, skuId, transactionType, quantity, referenceNo, referenceType, reason } = body;

        if (!warehouseId || !skuId || !transactionType) {
            return new NextResponse("Warehouse, SKU and transaction type required", { status: 400 });
        }

        const transaction = await db.inventoryTransaction.create({
            data: {
                warehouseId, locationId, skuId, transactionType,
                quantity: parseFloat(quantity) || 0,
                referenceNo, referenceType, reason
            },
            include: { warehouse: true, location: true, sku: true }
        });
        return NextResponse.json(transaction);
    } catch (error) {
        console.error("[TRANSACTIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
