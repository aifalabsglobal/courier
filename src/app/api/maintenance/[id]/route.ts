import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const { type, description, cost, odometer, performedBy, performedAt, nextDueAt, status, notes } = body;

        const maintenance = await db.vehicleMaintenance.update({
            where: { id },
            data: {
                type, description,
                cost: cost ? parseFloat(cost) : undefined,
                odometer: odometer ? parseFloat(odometer) : undefined,
                performedBy,
                performedAt: performedAt ? new Date(performedAt) : undefined,
                nextDueAt: nextDueAt ? new Date(nextDueAt) : undefined,
                status, notes
            },
            include: { vehicle: true }
        });
        return NextResponse.json(maintenance);
    } catch (error) {
        console.error("[MAINTENANCE_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await db.vehicleMaintenance.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[MAINTENANCE_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
