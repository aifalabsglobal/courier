import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const { code, zone, aisle, rack, level, position, locationType, capacityWeight, capacityVolume, isActive } = body;

        const wLoc = await db.warehouseLocation.update({
            where: { id },
            data: {
                code, zone, aisle, rack, level, position, locationType,
                capacityWeight: capacityWeight ? parseFloat(capacityWeight) : undefined,
                capacityVolume: capacityVolume ? parseFloat(capacityVolume) : undefined,
                isActive
            },
            include: { warehouse: true }
        });
        return NextResponse.json(wLoc);
    } catch (error) {
        console.error("[WAREHOUSE_LOCATION_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await db.warehouseLocation.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[WAREHOUSE_LOCATION_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
