import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const maintenance = await db.vehicleMaintenance.findMany({
            include: { vehicle: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(maintenance);
    } catch (error) {
        console.error("[MAINTENANCE_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { vehicleId, type, description, cost, odometer, performedBy, performedAt, nextDueAt, status, notes } = body;

        if (!vehicleId || !type) return new NextResponse("Vehicle and type required", { status: 400 });

        const maintenance = await db.vehicleMaintenance.create({
            data: {
                vehicleId, type, description,
                cost: cost ? parseFloat(cost) : 0,
                odometer: odometer ? parseFloat(odometer) : null,
                performedBy,
                performedAt: performedAt ? new Date(performedAt) : null,
                nextDueAt: nextDueAt ? new Date(nextDueAt) : null,
                status: status || "SCHEDULED",
                notes
            },
            include: { vehicle: true }
        });
        return NextResponse.json(maintenance);
    } catch (error) {
        console.error("[MAINTENANCE_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
