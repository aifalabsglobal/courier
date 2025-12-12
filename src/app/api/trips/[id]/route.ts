import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        const body = await req.json();
        const { vehicleId, driverId, origin, destination, distance, estimatedHours, plannedDeparture, plannedArrival, actualDeparture, actualArrival, status } = body;

        const trip = await db.trip.update({
            where: { id },
            data: {
                vehicleId: vehicleId || null,
                driverId: driverId || null,
                origin, destination,
                distance: distance ? parseFloat(distance) : undefined,
                estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
                plannedDeparture: plannedDeparture ? new Date(plannedDeparture) : undefined,
                plannedArrival: plannedArrival ? new Date(plannedArrival) : undefined,
                actualDeparture: actualDeparture ? new Date(actualDeparture) : undefined,
                actualArrival: actualArrival ? new Date(actualArrival) : undefined,
                status
            },
            include: { vehicle: true, driver: true }
        });
        return NextResponse.json(trip);
    } catch (error) {
        console.error("[TRIP_PUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { id } = await params;
        await db.trip.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[TRIP_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
