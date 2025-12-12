import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const trips = await db.trip.findMany({
            include: { vehicle: true, driver: true },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(trips);
    } catch (error) {
        console.error("[TRIPS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { vehicleId, driverId, origin, destination, distance, estimatedHours, plannedDeparture, plannedArrival, status } = body;

        let company = await db.company.findFirst();
        if (!company) {
            company = await db.company.create({ data: { name: "Default Company", email: "admin@example.com" } });
        }

        const count = await db.trip.count();
        const tripNo = `TRP-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        const trip = await db.trip.create({
            data: {
                companyId: company.id,
                tripNo,
                vehicleId: vehicleId || null,
                driverId: driverId || null,
                origin, destination,
                distance: distance ? parseFloat(distance) : null,
                estimatedHours: estimatedHours ? parseFloat(estimatedHours) : null,
                plannedDeparture: plannedDeparture ? new Date(plannedDeparture) : null,
                plannedArrival: plannedArrival ? new Date(plannedArrival) : null,
                status: status || "PLANNED",
                orderIds: "[]"
            },
            include: { vehicle: true, driver: true }
        });
        return NextResponse.json(trip);
    } catch (error) {
        console.error("[TRIPS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
