import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const wLocs = await db.warehouseLocation.findMany({
            include: { warehouse: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(wLocs);
    } catch (error) {
        console.error("[WAREHOUSE_LOCATIONS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { warehouseId, code, zone, aisle, rack, level, position, locationType, capacityWeight, capacityVolume, isActive } = body;

        if (!warehouseId) return new NextResponse("Warehouse ID required", { status: 400 });

        const wLoc = await db.warehouseLocation.create({
            data: {
                warehouseId, code, zone, aisle, rack, level, position, locationType,
                capacityWeight: capacityWeight ? parseFloat(capacityWeight) : null,
                capacityVolume: capacityVolume ? parseFloat(capacityVolume) : null,
                isActive: isActive ?? true
            },
            include: { warehouse: true }
        });
        return NextResponse.json(wLoc);
    } catch (error) {
        console.error("[WAREHOUSE_LOCATIONS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
